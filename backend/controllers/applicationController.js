import { supabase } from "../services/supabaseService.js";

export async function createApplication(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        status: "draft",
        current_step: 1,
      })
      .select()
      .single();

    if (error) {
      console.error("APPLICATION CREATE ERROR:");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create application.",
        error,
      });
    }

    return res.status(201).json({
      success: true,
      applicationId: data.id,
      application: data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}