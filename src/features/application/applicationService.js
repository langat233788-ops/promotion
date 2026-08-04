import { supabase } from "../../services/supabase";

/**
 * Create a new draft application
 */
export async function createApplication(userId) {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: userId,
      status: "draft",
      current_step: 1,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get all applications for a user
 */
export async function getApplications(userId) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Get current draft application
 */
export async function getDraftApplication(userId) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "draft")
    .maybeSingle();

  if (error) throw error;

  return data;
}

/**
 * Get application by ID
 */
export async function getApplicationById(applicationId) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Save Step 1 - Personal Information
 */
export async function saveStep1(applicationId, formData) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      country: formData.country,
      national_id: formData.national_id,
      phone: formData.phone,
      occupation: formData.occupation,
      marital_status: formData.marital_status,
      county: formData.county,
      city: formData.city,
      postal_address: formData.postal_address,
      current_step: 2,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Save Step 2 - Additional Information
 */
export async function saveStep2(applicationId, formData) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      education_level: formData.education_level,
      employment_status: formData.employment_status,
      monthly_income: formData.monthly_income,
      source_of_income: formData.source_of_income,
      residential_address: formData.residential_address,
      current_step: 3,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Save Step 3 - Promotion Package
 */
export async function saveStep3(applicationId, formData) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      promotion_amount: formData.promotion_amount,
      activation_fee: formData.activation_fee,
      current_step: 4,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Generic update for any application fields
 */
export async function updateApplication(applicationId, values) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update current application step
 */
export async function updateApplicationStep(applicationId, step) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      current_step: step,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Submit application
 */
export async function submitApplication(applicationId) {
  const { data, error } = await supabase
    .from("applications")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete application
 */
export async function deleteApplication(applicationId) {
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId);

  if (error) throw error;

  return true;
}