import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// Load environment variables
dotenv.config();

// Check if .env is loading correctly
console.log("==================================");
console.log("Working Directory:", process.cwd());
console.log("Consumer Key Loaded:", !!process.env.CONSUMER_KEY);
console.log("Consumer Secret Loaded:", !!process.env.CONSUMER_SECRET);
console.log("==================================");

const app = express();

// =======================
// Middleware
// =======================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =======================
// Health Check
// =======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UNPA Backend API is running.",
  });
});

// =======================
// API Routes
// =======================

app.use("/api/auth", authRoutes);

app.use("/api/mpesa", mpesaRoutes);

app.use("/api/applications", applicationRoutes);

// =======================
// 404 Handler
// =======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// =======================
// Start Server
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log("UNPA Backend Started Successfully");
  console.log(`Server running on port ${PORT}`);
  console.log("==================================");
});