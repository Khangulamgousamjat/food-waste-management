import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (
  email: string,
  password: string,
  userData: {
    full_name: string;
    account_type: "donor" | "recipient";
    phone_number?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    ngo_certification_url?: string;
  }
) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return { data: null, error: authError };
    }

    if (authData.user) {
      // Then create the profile record
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            email: email,
            full_name: userData.full_name,
            account_type: userData.account_type,
            phone_number: userData.phone_number || null,
            address: userData.address || null,
            city: userData.city || null,
            state: userData.state || null,
            country: userData.country || null,
            postal_code: userData.postal_code || null,
            ngo_certification_url: userData.ngo_certification_url || null,
            rating: 0,
            total_donations: 0,
            total_points: 0,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // If profile creation fails, we should delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { data: null, error: profileError };
      }

      return { data: { ...authData, profile: profileData }, error: null };
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error("Unexpected error during signup:", error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Database helper functions
export const getFoodListings = async (filters = {}) => {
  let query = supabase.from("food_listings").select("*");

  // Apply filters if provided
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query.order("created_at", { ascending: false });
  return { data, error };
};

export const getUserDonations = async (userId: string) => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("donor_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getUserRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("food_requests")
    .select("*, food_listings(*)")
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const addFoodListing = async (listingData: any) => {
  const { data, error } = await supabase
    .from("food_listings")
    .insert([listingData])
    .select();

  return { data, error };
};

export const requestFood = async (requestData: any) => {
  const { data, error } = await supabase
    .from("food_requests")
    .insert([requestData])
    .select();

  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();

  return { data, error };
};

export const getAvailableDonations = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  return { data, error };
};

export const claimDonation = async (donationId: string, userId: string) => {
  const { data, error } = await supabase
    .from("donation_claims")
    .insert([
      {
        donation_id: donationId,
        recipient_id: userId,
        status: "reserved",
      },
    ])
    .select();

  if (!error) {
    // Update donation status
    await supabase
      .from("donations")
      .update({ status: "reserved" })
      .eq("id", donationId);
  }

  return { data, error };
};

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, total_points, total_donations")
    .order("total_points", { ascending: false })
    .limit(10);

  return { data, error };
};

export const getAnalytics = async () => {
  const { data, error } = await supabase.from("analytics").select("*").single();

  return { data, error };
};
