import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import FormInput from "../../components/application/FormInput";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import { useApplication } from "../../features/application/ApplicationContext";

import {
  getApplicationById,
  updateApplication,
} from "../../features/application/applicationService";

function Step4() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(false);

  const [promotionAmount, setPromotionAmount] = useState(0);

  const [activationFee, setActivationFee] = useState(0);

  const [phone, setPhone] = useState("");

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      try {
        const application =
          await getApplicationById(applicationId);

        setPromotionAmount(
          Number(application.promotion_amount || 0)
        );

        setActivationFee(
          Number(application.activation_fee || 0)
        );

        setPhone(
          application.activation_payment_phone || ""
        );

        setAccepted(
          application.activation_fee_paid || false
        );
      } catch (error) {
        console.error(error);

        alert("Failed to load application.");
      }
    }

    loadApplication();
  }, [applicationId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!phone.trim()) {
      alert("Please enter your M-Pesa number.");
      return;
    }

    if (!accepted) {
      alert("Please accept the refund policy.");
      return;
    }

    try {
      setLoading(true);

      // Temporary payment simulation
      await new Promise((resolve) =>
        setTimeout(resolve, 2500)
      );

      await updateApplication(applicationId, {
        activation_fee_paid: true,
        activation_payment_phone: phone,
        activation_payment_reference:
          "SIM-" + Date.now(),
        activation_payment_date:
          new Date().toISOString(),
      });

      await saveCurrentStep(applicationId, 5);

      alert("Activation fee paid successfully.");

      navigate(
        `/apply/${applicationId}/payout-method`
      );
    } catch (error) {
      console.error(error);

      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(
      `/apply/${applicationId}/step3-package`
    );
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 4 - Activation Fee Payment"
        description="Pay the activation fee to continue with your application."
        step={4}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Payment Summary */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            Payment Summary
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Promotion Amount
              </span>

              <span className="font-bold">
                KES {promotionAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-semibold">
                Activation Fee (10%)
              </span>

              <span className="text-2xl font-bold text-blue-700">
                KES {activationFee.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Refund Notice */}

        <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-6">
          <h3 className="mb-3 text-lg font-bold text-yellow-700">
            Refund Policy
          </h3>

          <p className="leading-7 text-gray-700">
            The activation fee is required before your application
            can proceed. This fee is <strong>fully refundable</strong>
            if your application is not processed.
          </p>
        </div>

        {/* Payment Method */}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h3 className="mb-2 text-lg font-bold text-green-700">
            Payment Method
          </h3>

          <p className="text-gray-700">
            Payment will be made through <strong>M-Pesa</strong>.
            Enter the phone number that will receive the STK Push.
          </p>
        </div>

        {/* Phone Number */}

        <FormInput
          label="M-Pesa Number"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XXXXXXXX"
          required
        />

        {/* Agreement */}

        <label className="flex items-start gap-3 rounded-xl border bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-5 w-5"
          />

          <span className="text-gray-700">
            I understand that the activation fee is fully refundable
            if my application is not processed.
          </span>
        </label>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={
            loading
              ? "Processing Payment..."
              : `Pay KES ${activationFee.toLocaleString()}`
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step4;