import { stkPush } from "../services/mpesaService.js";
import { supabase } from "../services/supabaseService.js";

/**
 * Initiate M-Pesa STK Push
 */
export async function initiateSTKPush(req, res) {
  try {
    const {
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      applicationId,
      userId,
    } = req.body;

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

    // Save pending payment
    const { data, error } = await supabase
      .from("payments")
      .insert({
        application_id: applicationId || null,
        user_id: userId || null,
        merchant_request_id: response.MerchantRequestID,
        checkout_request_id: response.CheckoutRequestID,
        phone_number: phoneNumber,
        amount,
        status: "pending",
      })
      .select();

    if (error) {
      console.error("========== SUPABASE INSERT ERROR ==========");
      console.error(error);
      console.error("===========================================");

      return res.status(500).json({
        success: false,
        message: "Failed to save payment.",
        error,
      });
    }

    console.log("Payment inserted successfully.");
    console.log(data);

    return res.json({
      success: true,
      message: "STK Push sent successfully.",
      data: response,
    });
  } catch (error) {
    console.error("========== STK PUSH ERROR ==========");
    console.error(error.response?.data || error.message);
    console.error("===================================");

    return res.status(500).json({
      success: false,
      message: "Failed to initiate STK Push.",
      error: error.response?.data || error.message,
    });
  }
}

/**
 * M-Pesa Callback
 */
export async function mpesaCallback(req, res) {
  try {
    console.log("========== M-PESA CALLBACK ==========");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("=====================================");

    const callback = req.body.Body?.stkCallback;

    if (!callback) {
      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    // Payment failed
    if (resultCode !== 0) {
      const { error } = await supabase
        .from("payments")
        .update({
          result_code: resultCode,
          result_desc: resultDesc,
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("checkout_request_id", checkoutRequestId);

      if (error) {
        console.error("UPDATE FAILED:", error);
      }

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const callbackItems = callback.CallbackMetadata?.Item || [];

    const getValue = (name) => {
      const item = callbackItems.find((i) => i.Name === name);
      return item ? item.Value : null;
    };

    const amount = getValue("Amount");
    const receipt = getValue("MpesaReceiptNumber");
    const transactionDate = getValue("TransactionDate");
    const phoneNumber = getValue("PhoneNumber");

    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        amount,
        mpesa_receipt_number: receipt,
        phone_number: phoneNumber?.toString(),
        transaction_date: transactionDate
          ? new Date(transactionDate.toString())
          : null,
        result_code: resultCode,
        result_desc: resultDesc,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("checkout_request_id", checkoutRequestId)
      .select()
      .single();

    if (error) {
      console.error("========== CALLBACK UPDATE ERROR ==========");
      console.error(error);
      console.error("===========================================");

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    console.log("Payment updated successfully.");

    if (payment?.application_id) {
      const { error: applicationError } = await supabase
        .from("applications")
        .update({
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.application_id);

      if (applicationError) {
        console.error("APPLICATION UPDATE ERROR:");
        console.error(applicationError);
      }
    }

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("========== CALLBACK ERROR ==========");
    console.error(error);
    console.error("====================================");

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}