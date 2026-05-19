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
      // Fetch profile data from profiles table using uuid
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('uuid', user.id)
        .single();

      set({
        user: {
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          firstname: profile?.firstname || '',
          lastname: profile?.lastname || '',
          nickname: profile?.nickname || '',
          full_address: profile?.full_address || '',
          street: profile?.street || '',
          barangay: profile?.barangay || '',
          city: profile?.city || '',
          province: profile?.province || '',
          zipcode: profile?.zipcode || '',
          uuid: profile?.uuid || '',
          role: profile?.role || USER_ROLE.USER,
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
      // Fetch profile data from profiles table using uuid
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('uuid', session.user.id)
        .single();

      set({
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          firstname: profile?.firstname || '',
          lastname: profile?.lastname || '',
          nickname: profile?.nickname || '',
          full_address: profile?.full_address || '',
          street: profile?.street || '',
          barangay: profile?.barangay || '',
          city: profile?.city || '',
          province: profile?.province || '',
          zipcode: profile?.zipcode || '',
          uuid: profile?.uuid || '',
          role: profile?.role || USER_ROLE.USER,
        },
        loading: false,
      });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('uuid', session.user.id)
          .single();

        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            firstname: profile?.firstname || '',
            lastname: profile?.lastname || '',
            nickname: profile?.nickname || '',
            full_address: profile?.full_address || '',
            street: profile?.street || '',
            barangay: profile?.barangay || '',
            city: profile?.city || '',
            province: profile?.province || '',
            zipcode: profile?.zipcode || '',
            uuid: profile?.uuid || '',
            role: profile?.role || USER_ROLE.USER,
          },
        });
      } else {
        set({ user: null });
      }
    });
  },
}));
