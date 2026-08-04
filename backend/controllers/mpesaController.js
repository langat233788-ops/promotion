import { stkPush } from "../services/mpesaService.js";

export async function initiateSTKPush(req, res) {
  try {
    const {
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
    } = req.body;

    // Basic validation
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone number and amount are required.",
      });
    }

    const response = await stkPush(
      phoneNumber,
      amount,
      accountReference || "UNPA",
      transactionDesc || "United Nations Promotional Award"
    );

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("========== STK PUSH ERROR ==========");
    console.error(error.response?.data || error.message);
    console.error("===================================");

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}

export async function mpesaCallback(req, res) {
  console.log("========== CALLBACK ==========");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("==============================");

  res.json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
}