import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, getCurrentUser } from "../lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Extend the Supabase User type
interface ExtendedUser extends SupabaseUser {
  accountType?: "donor" | "recipient";
}

interface AuthContextType {
  user: ExtendedUser | null;
  profile: any | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in loadProfile:", err);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const { user: supabaseUser, error } = await getCurrentUser();

      if (error) {
        throw error;
      }

      if (supabaseUser) {
        const userProfile = await loadProfile(supabaseUser.id);
        setProfile(userProfile);

        // Create extended user with account type from profile
        const extendedUser: ExtendedUser = {
          ...supabaseUser,
          accountType: userProfile?.account_type || undefined,
        };
        setUser(extendedUser);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      console.error("Error refreshing user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    // Initial check for user session
    refreshUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          const userProfile = await loadProfile(session.user.id);
          setProfile(userProfile);

          // Create extended user with account type from profile
          const extendedUser: ExtendedUser = {
            ...session.user,
            accountType: userProfile?.account_type || undefined,
          };
          setUser(extendedUser);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    refreshUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
