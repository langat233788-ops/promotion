import { supabase } from "../services/supabaseService.js";
import { randomUUID } from "crypto";

export async function createProfile(req, res) {
  try {
    const { fullName, phone } = req.body;

    // Basic validation
    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name and phone are required.",
      });
    }

    // Generate a UUID for the profile
    const id = randomUUID();

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id,
        full_name: fullName,
        phone,
      })
      .select()
      .single();

    if (error) {
      console.error("PROFILE CREATE ERROR:");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create profile.",
        error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profile: data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}