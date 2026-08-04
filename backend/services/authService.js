import axios from "axios";

export async function getAccessToken() {
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Consumer Key or Consumer Secret missing in .env");
  }

  const auth = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");

  try {
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return data.access_token;
  } catch (error) {
    console.error("Daraja OAuth Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
}