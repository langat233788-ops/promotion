import { supabase } from "../../services/supabase";

/**
 * Register a new user
 */
export async function registerUser({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

/**
 * Login
 */
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

/**
 * Logout
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}