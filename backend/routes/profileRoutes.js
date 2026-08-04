import express from "express";
import { createProfile } from "../controllers/profileController.js";

const router = express.Router();

// Create a new profile
router.post("/", createProfile);

export default router;