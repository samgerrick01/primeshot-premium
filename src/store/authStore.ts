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
}

async function fetchOrCreateProfile(
  authUserId: string,
  email: string,
): Promise<{
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
}> {
  const defaults = {
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

export const useAuthStore = create<AuthState>((set) => ({
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
      const profile = await fetchOrCreateProfile(user.id, user.email ?? '');

      set({
        user: {
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          ...profile,
        },
      });
    }

    return { error: null };
  },
  signUp: async (email, password, profileData) => {
    // Step 1: Sign up with Supabase Auth
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${profileData.firstname} ${profileData.lastname}`,
        },
      },
    });
    if (error) return { error: error.message };

    // Step 2: Save profile data to the profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        uuid: authData.user.id,
        role: USER_ROLE.USER,
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        nickname: profileData.nickname,
        full_address: profileData.full_address,
        street: profileData.street,
        barangay: profileData.barangay,
        city: profileData.city,
        province: profileData.province,
        zipcode: profileData.zipcode,
        email: email,
      });

      if (profileError) {
        return { error: profileError.message };
      }
    }

    return { error: null };
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchOrCreateProfile(
        session.user.id,
        session.user.email ?? '',
      );

      set({
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          ...profile,
        },
        loading: false,
      });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchOrCreateProfile(
          session.user.id,
          session.user.email ?? '',
        );

        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            ...profile,
          },
        });
      } else {
        set({ user: null });
      }
    });
  },
}));
