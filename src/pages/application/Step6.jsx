import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import FormInput from "../../components/application/FormInput";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  getApplicationById,
  updateApplication,
} from "../../features/application/applicationService";

import { useApplication } from "../../features/application/ApplicationContext";

function Step6() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(false);

  const [promotionAmount, setPromotionAmount] = useState(0);

  const [payoutMethod, setPayoutMethod] = useState("");

  const [payoutFee, setPayoutFee] = useState(0);

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

        setPayoutMethod(
          application.payout_method || ""
        );

        setPayoutFee(
          Number(application.payout_fee || 0)
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

      // Fake payment for now
      await new Promise((resolve) =>
        setTimeout(resolve, 2500)
      );

      await updateApplication(applicationId, {
        payout_fee_paid: true,
        payout_payment_phone: phone,
        payout_payment_reference:
          "PAY" + Date.now(),
        payout_payment_date:
          new Date().toISOString(),
      });

      await saveCurrentStep(applicationId, 7);

      alert(
        "Payout transaction fee paid successfully."
      );

      navigate(
        `/apply/${applicationId}/step7`
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
      `/apply/${applicationId}/payout-details`
    );
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 6 - Payout Transaction Fee"
        description="Pay the refundable payout transaction fee to complete your application."
        step={6}
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

            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Payout Method
              </span>

              <span className="font-bold capitalize">
                {payoutMethod}
              </span>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-semibold">
                Transaction Fee
              </span>

              <span className="text-2xl font-bold text-blue-700">
                KES {payoutFee.toLocaleString()}
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
            The payout transaction fee is required before
            your application can be submitted for review.
            This fee is <strong>fully refundable</strong> if
            your application is not processed.
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
            I understand that the payout transaction fee is
            fully refundable if my application is not
            processed.
          </span>
        </label>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={
            loading
              ? "Processing Payment..."
              : `Pay KES ${payoutFee.toLocaleString()}`
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step6;