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

function Step4() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { user } = useAuth();
  const { saveCurrentStep } = useApplication();

  const [application, setApplication] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);

  const intervalRef = useRef(null);

  async function loadApplication() {
    try {
      const data = await getApplicationById(applicationId);

      setApplication(data);

      setPhone(
        data.activation_payment_phone ||
          data.phone ||
          ""
      );
    } catch (error) {
      console.error(error);
      alert("Failed to load application.");
    }
  }

  useEffect(() => {
    loadApplication();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [applicationId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!application) {
      alert("Application not loaded.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/mpesa/stkpush",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
            amount: application.activation_fee,
            applicationId: application.id,
            userId: user.id,
            accountReference:
              application.reference_no ||
              application.id,
            transactionDesc: "Activation Fee",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to send STK Push."
        );
      }

      alert(
        "STK Push sent successfully. Check your phone and enter your M-Pesa PIN."
      );

      setWaitingPayment(true);

      intervalRef.current = setInterval(async () => {
        try {
          const latest = await getApplicationById(
            applicationId
          );

          if (latest.activation_fee_paid) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;

            await saveCurrentStep(applicationId, 5);

            navigate(`/apply/${applicationId}/step5`);
          }
        } catch (error) {
          console.error(error);
        }
      }, 3000);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    navigate(`/apply/${applicationId}/step3-package`);
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
        title="Step 4 - Activation Fee Payment"
        description="Pay your activation fee through M-Pesa to continue."
        step={4}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-5 text-xl font-bold text-blue-700">
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

            <div className="flex justify-between border-t pt-4">
              <span>Activation Fee (10%)</span>

              <strong className="text-red-600">
                KES{" "}
                {Number(
                  application.activation_fee
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6">
          <h3 className="mb-2 text-lg font-bold text-yellow-700">
            Payment Instructions
          </h3>

          <p className="leading-7 text-gray-700">
            Enter the M-Pesa number that will receive the STK Push.
            After clicking <strong>Pay Now</strong>,
            check your phone and enter your M-Pesa PIN.
          </p>
        </div>

        <FormInput
          label="M-Pesa Phone Number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="2547XXXXXXXX"
          required
        />
                {waitingPayment && (
          <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
            <h3 className="text-xl font-bold text-green-700">
              Waiting for Payment Confirmation...
            </h3>

            <p className="mt-3 leading-7 text-gray-700">
              An STK Push has been sent to your phone.
              <br />
              Please enter your M-Pesa PIN to complete the payment.
              <br />
              This page will continue automatically once payment has
              been confirmed.
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
                  application.activation_fee
                ).toLocaleString()}`
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step4;