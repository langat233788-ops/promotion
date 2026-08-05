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

    // Determine payment purpose
    const purpose =
      transactionDesc === "Payout Transaction Fee"
        ? "payout_fee"
        : "activation_fee";

    const { error } = await supabase
      .from("payments")
      .insert({
        application_id: applicationId || null,
        user_id: userId || null,
        merchant_request_id: response.MerchantRequestID,
        checkout_request_id: response.CheckoutRequestID,
        phone_number: phoneNumber,
        amount,
        payment_type: "mpesa",
        purpose,
        status: "pending",
      });

    if (error) {
      console.error("========== PAYMENT INSERT ERROR ==========");
      console.error(error);
      console.error("==========================================");

      return res.status(500).json({
        success: false,
        message: "Failed to save payment.",
        error,
      });
    }

    console.log("Payment created successfully.");
    console.log("Purpose:", purpose);

    return res.json({
      success: true,
      message: "STK Push sent successfully.",
      data: response,
    });
  } catch (error) {
    console.error("========== STK PUSH ERROR ==========");
    console.error(error.response?.data || error.message);
    console.error("====================================");

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
      await supabase
        .from("payments")
        .update({
          result_code: resultCode,
          result_desc: resultDesc,
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("checkout_request_id", checkoutRequestId);

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
        const { data: payment, error: paymentError } = await supabase
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

    if (paymentError) {
      console.error("========== PAYMENT UPDATE ERROR ==========");
      console.error(paymentError);

      return res.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    console.log("Payment updated successfully.");
    console.log(payment);

    // Update application depending on payment purpose
    if (payment.application_id) {
      let updateData = {};

      if (payment.purpose === "activation_fee") {
        updateData = {
          activation_fee_paid: true,
          activation_payment_reference: receipt,
          activation_payment_phone: phoneNumber?.toString(),
          activation_payment_date: new Date().toISOString(),
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        };
      } else if (payment.purpose === "payout_fee") {
        updateData = {
          payout_fee_paid: true,
          payout_payment_reference: receipt,
          payout_payment_phone: phoneNumber?.toString(),
          payout_payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const {
        data: updatedApplication,
        error: applicationError,
      } = await supabase
        .from("applications")
        .update(updateData)
        .eq("id", payment.application_id)
        .select();

      console.log("========== APPLICATION UPDATE ==========");
      console.log(updatedApplication);

      if (applicationError) {
        console.error("APPLICATION UPDATE ERROR");
        console.error(
          JSON.stringify(applicationError, null, 2)
        );
      } else {
        console.log("Application updated successfully.");
      }

      console.log("========================================");
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