import axios from "axios";
import { getAccessToken } from "./authService.js";

function generateTimestamp() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hour = String(now.getHours()).padStart(2, "0");

  const minute = String(now.getMinutes()).padStart(2, "0");

  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}

export async function stkPush(phoneNumber, amount, accountReference, transactionDesc) {
  const token = await getAccessToken();

  const shortcode = process.env.SHORTCODE;

  const passkey = process.env.PASSKEY;

  const callbackUrl = process.env.CALLBACK_URL;

  const timestamp = generateTimestamp();

  const password = Buffer.from(
    shortcode + passkey + timestamp
  ).toString("base64");

  const { data } = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}