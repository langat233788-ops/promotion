import express from "express";
import {
  initiateSTKPush,
  mpesaCallback,
} from "../controllers/mpesaController.js";

const router = express.Router();

// Initiate STK Push
router.post("/stkpush", initiateSTKPush);

// Safaricom Callback
router.post("/callback", mpesaCallback);

export default router;