import express from "express";
import { createApplication } from "../controllers/applicationController.js";

const router = express.Router();

// Create a new application
router.post("/", createApplication);

export default router;