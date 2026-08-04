import { stkPush } from "../services/mpesaService.js";

export async function initiateSTKPush(req, res) {
  try {
    const {
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
    } = req.body;

    const response = await stkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    );

    res.json(response);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "STK Push failed.",
      error: error.response?.data || error.message,
    });
  }
}