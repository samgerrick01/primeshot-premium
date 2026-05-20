import { create } from 'zustand';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { USER_ROLE } from '@/constants/enums';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    profileData: {
      firstname: string;
      lastname: string;
      nickname: string;
      full_address: string;
      street: string;
      barangay: string;
      city: string;
      province: string;
      zipcode: string;
    },
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
}

type ProfileResult = {
  firstname: string;
  lastname: string;
  nickname: string;
  full_address: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipcode: string;
  uuid: string;
  role: string;
};

async function fetchOrCreateProfile(
  authUserId: string,
  email: string,
  user_metadata?: Record<string, any>,
): Promise<ProfileResult> {
  const defaults: ProfileResult = {
    firstname: '',
    lastname: '',
    nickname: '',
    full_address: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
    uuid: '',
    role: USER_ROLE.USER,
  };

  try {
    // Try to find profile by uuid first
    const { data: uuidProfile, error: uuidError } = await supabase
      .from('profiles')
      .select('*')
      .eq('uuid', authUserId)
      .maybeSingle();

    console.log('[fetchOrCreateProfile] uuid lookup:', {
      uuidProfile,
      uuidError,
      authUserId,
    });

    if (uuidProfile) {
      console.log(
        '[fetchOrCreateProfile] Found by UUID, role:',
        uuidProfile.role,
      );

      // If profile was created by the old trigger (empty data), try to
      // fill it in from the user's metadata
      const needsBackfill =
        !uuidProfile.firstname &&
        !uuidProfile.lastname &&
        user_metadata?.firstname;

      if (needsBackfill && authUserId) {
        console.log('[fetchOrCreateProfile] Backfilling profile from metadata');
        const { error } = await supabase.rpc('upsert_profile', {
          p_uuid: authUserId,
          p_email: email,
          p_role: uuidProfile.role || USER_ROLE.USER,
          p_firstname: user_metadata?.firstname || '',
          p_lastname: user_metadata?.lastname || '',
          p_nickname: user_metadata?.nickname || '',
          p_full_address: user_metadata?.full_address || '',
          p_street: user_metadata?.street || '',
          p_barangay: user_metadata?.barangay || '',
          p_city: user_metadata?.city || '',
          p_province: user_metadata?.province || '',
          p_zipcode: user_metadata?.zipcode || '',
        });
        if (!error) {
          return {
            firstname: user_metadata?.firstname || '',
            lastname: user_metadata?.lastname || '',
            nickname: user_metadata?.nickname || '',
            full_address: user_metadata?.full_address || '',
            street: user_metadata?.street || '',
            barangay: user_metadata?.barangay || '',
            city: user_metadata?.city || '',
            province: user_metadata?.province || '',
            zipcode: user_metadata?.zipcode || '',
            uuid: uuidProfile.uuid || '',
            role: uuidProfile.role || USER_ROLE.USER,
          };
        }
      }

      return {
        firstname: uuidProfile.firstname || '',
        lastname: uuidProfile.lastname || '',
        nickname: uuidProfile.nickname || '',
        full_address: uuidProfile.full_address || '',
        street: uuidProfile.street || '',
        barangay: uuidProfile.barangay || '',
        city: uuidProfile.city || '',
        province: uuidProfile.province || '',
        zipcode: uuidProfile.zipcode || '',
        uuid: uuidProfile.uuid || '',
        role: uuidProfile.role || USER_ROLE.USER,
      };
    }

    // Fallback: try to find profile by email
    const { data: emailProfile, error: emailError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    console.log('[fetchOrCreateProfile] email lookup:', {
      emailProfile,
      emailError,
      email,
    });

    if (emailProfile) {
      console.log(
        '[fetchOrCreateProfile] Found by email, role:',
        emailProfile.role,
      );
      // Update the profile's uuid for future lookups
      await supabase
        .from('profiles')
        .update({ uuid: authUserId })
        .eq('id', emailProfile.id);

      return {
        firstname: emailProfile.firstname || '',
        lastname: emailProfile.lastname || '',
        nickname: emailProfile.nickname || '',
        full_address: emailProfile.full_address || '',
        street: emailProfile.street || '',
        barangay: emailProfile.barangay || '',
        city: emailProfile.city || '',
        province: emailProfile.province || '',
        zipcode: emailProfile.zipcode || '',
        uuid: emailProfile.uuid || '',
        role: emailProfile.role || USER_ROLE.USER,
      };
    }

    // No profile found at all - return defaults
    console.log('[fetchOrCreateProfile] No profile found, using defaults');
    return {
      ...defaults,
      uuid: authUserId,
    };
  } catch (err) {
    console.error('[fetchOrCreateProfile] Error:', err);
    return defaults;
  }
}

function buildUserObject(
  sessionUser: import('@supabase/supabase-js').User,
  profile: ProfileResult,
): User {
  return {
    id: sessionUser.id,
    email: sessionUser.email ?? '',
    full_name: sessionUser.user_metadata?.full_name,
    avatar_url: sessionUser.user_metadata?.avatar_url,
    ...profile,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _authListener: any = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const profile = await fetchOrCreateProfile(
        user.id,
        user.email ?? '',
        user.user_metadata,
      );

      set({
        user: buildUserObject(user, profile),
      });
    }

    return { error: null };
  },
  signUp: async (email, password, profileData) => {
    // Sign up with Supabase Auth
    // Email confirmation is sent by Supabase via Brevo SMTP
    // (configured in Supabase Dashboard > Authentication > Settings > SMTP Settings)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${profileData.firstname} ${profileData.lastname}`,
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          nickname: profileData.nickname,
          full_address: profileData.full_address,
          street: profileData.street,
          barangay: profileData.barangay,
          city: profileData.city,
          province: profileData.province,
          zipcode: profileData.zipcode,
        },
      },
    });
    if (error) return { error: error.message };

    // Immediately try to upsert the profile so all metadata is saved
    if (data?.user?.id) {
      try {
        await supabase.rpc('upsert_profile', {
          p_uuid: data.user.id,
          p_email: email,
          p_role: USER_ROLE.USER,
          p_firstname: profileData.firstname,
          p_lastname: profileData.lastname,
          p_nickname: profileData.nickname,
          p_full_address: profileData.full_address,
          p_street: profileData.street,
          p_barangay: profileData.barangay,
          p_city: profileData.city,
          p_province: profileData.province,
          p_zipcode: profileData.zipcode,
        });
      } catch (upsertErr) {
        console.error('[signUp] Failed to upsert profile:', upsertErr);
      }
    }

    return { error: null };
  },
  signOut: async () => {
    // Always clear user state first, even if Supabase API call fails
    set({ user: null });
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[signOut] Error signing out:', err);
    }
  },
  initialize: async () => {
    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await fetchOrCreateProfile(
        session.user.id,
        session.user.email ?? '',
        session.user.user_metadata,
      );

      set({
        user: buildUserObject(session.user, profile),
        loading: false,
      });
    } else {
      set({ loading: false });
    }

    // Clean up previous listener to avoid duplicates
    if (_authListener) {
      _authListener.subscription.unsubscribe();
    }

    // Listen for auth state changes (including after email confirmation auto-login)
    const { data } = supabase.auth.onAuthStateChange(

      async (event, session) => {
        console.log('[onAuthStateChange] event:', event, 'session:', !!session);

        if (event === 'SIGNED_OUT') {
          set({ user: null, loading: false });
          return;
        }

        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'INITIAL_SESSION'
        ) {
          if (session?.user) {
            const profile = await fetchOrCreateProfile(
              session.user.id,
              session.user.email ?? '',
              session.user.user_metadata,
            );

            set({
              user: buildUserObject(session.user, profile),
              loading: false,
            });
          }
        }
      },
    );

    _authListener = data;
  },
  updateProfile: async (data: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser?.id) {
      return { error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase.rpc('upsert_profile', {
        p_uuid: currentUser.id,
        p_email: currentUser.email,
        p_role: currentUser.role || USER_ROLE.USER,
        p_firstname: data.firstname ?? currentUser.firstname ?? '',
        p_lastname: data.lastname ?? currentUser.lastname ?? '',
        p_nickname: data.nickname ?? currentUser.nickname ?? '',
        p_full_address: data.full_address ?? currentUser.full_address ?? '',
        p_street: data.street ?? currentUser.street ?? '',
        p_barangay: data.barangay ?? currentUser.barangay ?? '',
        p_city: data.city ?? currentUser.city ?? '',
        p_province: data.province ?? currentUser.province ?? '',
        p_zipcode: data.zipcode ?? currentUser.zipcode ?? '',
      });

      if (error) return { error: error.message };

      // Update local state with new values
      set({
        user: { ...currentUser, ...data },
      });

      return { error: null };
    } catch (err: any) {
      console.error('[updateProfile] Error:', err);
      return { error: err?.message || 'Failed to update profile' };
    }
  },
}));
