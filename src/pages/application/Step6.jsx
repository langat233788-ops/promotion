import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import FormInput from "../../components/application/FormInput";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import { useAuth } from "../../features/auth/AuthContext";
import { useApplication } from "../../features/application/ApplicationContext";

import {
  getApplicationById,
} from "../../features/application/applicationService";

function Step6() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { user } = useAuth();
  const { saveCurrentStep } = useApplication();

  const [application, setApplication] = useState(null);

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [waitingPayment, setWaitingPayment] =
    useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplicationById(
          applicationId
        );

        setApplication(data);

        setPhone(
          data.payout_payment_phone ||
            data.phone ||
            ""
        );
      } catch (error) {
        console.error(error);

        alert("Failed to load application.");
      }
    }

    loadApplication();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [applicationId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!phone.trim()) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    if (!application) {
      alert("Application not loaded.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/mpesa/stkpush",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
            amount: application.payout_fee,
            applicationId: application.id,
            userId: user.id,
            accountReference:
              application.reference_no,
            transactionDesc:
              "Payout Transaction Fee",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to send STK Push."
        );
      }

      alert(
        "STK Push sent successfully. Complete the payment on your phone."
      );

      setWaitingPayment(true);

      intervalRef.current = setInterval(
        async () => {
          try {
            const latest =
              await getApplicationById(
                applicationId
              );

            if (latest.payout_fee_paid) {
              clearInterval(
                intervalRef.current
              );

              intervalRef.current = null;

              await saveCurrentStep(
                applicationId,
                7
              );

              navigate(
                `/apply/${applicationId}/step7`
              );
            }
          } catch (error) {
            console.error(error);
          }
        },
        3000
      );
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Payment request failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }

    navigate(
      `/apply/${applicationId}/payout-details`
    );
  }

  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading application...
      </div>
    );
  }

  return (
        <FormCard>
      <StepHeader
        title="Step 6 - Payout Transaction Fee"
        description="Pay the refundable payout transaction fee using M-Pesa."
        step={6}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Payment Summary */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-blue-700">
            Payment Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Promotion Amount</span>

              <strong>
                KES{" "}
                {Number(
                  application.promotion_amount
                ).toLocaleString()}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Payout Method</span>

              <strong className="capitalize">
                {application.payout_method}
              </strong>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg">
              <span>Transaction Fee</span>

              <strong className="text-red-600">
                KES{" "}
                {Number(
                  application.payout_fee
                ).toLocaleString()}
              </strong>
            </div>

          </div>
        </div>

        {/* Instructions */}

        <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5">
          <h3 className="mb-2 font-bold text-yellow-700">
            Payment Instructions
          </h3>

          <p className="leading-7 text-gray-700">
            Enter the M-Pesa phone number that will
            receive the STK Push. After clicking
            <strong> Pay Now</strong>, check your
            phone and enter your M-Pesa PIN to
            complete the payment.
          </p>
        </div>

        {/* Phone */}

        <FormInput
          label="M-Pesa Phone Number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="2547XXXXXXXX"
          required
        />

        {/* Waiting For Payment */}

        {waitingPayment && (
          <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
            <h3 className="text-xl font-bold text-green-700">
              Waiting for Payment Confirmation...
            </h3>

            <p className="mt-2 text-gray-700">
              An STK Push has been sent to your
              phone.
              <br />
              Enter your M-Pesa PIN to complete the
              payment.
              <br />
              This page will continue automatically
              once payment is confirmed.
            </p>
          </div>
        )}

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={
            loading
              ? "Sending STK Push..."
              : `Pay KES ${Number(
                  application.payout_fee
                ).toLocaleString()}`
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step6;