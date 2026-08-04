import express from "express";
import { getAccessToken } from "../services/authService.js";

const router = express.Router();

router.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("========== DARAJA ERROR ==========");
    console.error(error.response?.data || error.message);
    console.error("==================================");

    res.status(500).json({
      success: false,
      message: "Failed to obtain access token.",
      error: error.response?.data || error.message,
    });
  }
});

export default router;