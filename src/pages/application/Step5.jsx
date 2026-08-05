import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import { useApplication } from "../../features/application/ApplicationContext";

import {
  getApplicationById,
} from "../../features/application/applicationService";

function Step5() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplicationById(applicationId);
        setApplication(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  async function continueNext() {
    try {
      // User proceeds to Payout Method
      await saveCurrentStep(applicationId, 7);

      navigate(`/apply/${applicationId}/payout-method`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/step4`);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading payment details...
      </div>
    );
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 5 - Payment Successful"
        description="Your activation fee has been received successfully."
        step={5}
        totalSteps={12}
      />

      <div className="space-y-8">

        {/* Success Message */}

        <div className="rounded-2xl border border-green-300 bg-green-50 p-8 text-center">

          <div className="text-6xl">✅</div>

          <h2 className="mt-4 text-3xl font-bold text-green-700">
            Payment Successful
          </h2>

          <p className="mt-4 leading-7 text-gray-700">
            Thank you. Your activation fee has been received and verified
            successfully.
          </p>

        </div>

        {/* Payment Details */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="mb-6 text-2xl font-bold text-blue-700">
            Payment Details
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">
                Reference Number
              </span>

              <span className="font-semibold">
                {application.reference_no}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">
                Promotion Amount
              </span>

              <span className="font-semibold">
                KES{" "}
                {Number(application.promotion_amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">
                Activation Fee Paid
              </span>

              <span className="font-semibold text-green-700">
                KES{" "}
                {Number(application.activation_fee).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">
                M-Pesa Receipt
              </span>

              <span className="font-semibold">
                {application.activation_payment_reference}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">
                Paid Using
              </span>

              <span className="font-semibold">
                {application.activation_payment_phone}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Payment Status
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                PAID
              </span>
            </div>

          </div>

        </div>

        {/* Next Step */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <h3 className="text-xl font-bold text-blue-700">
            What's Next?
          </h3>

          <p className="mt-3 leading-7 text-gray-700">
            Your activation payment has been confirmed.
            The next step is to choose your preferred payout
            method before providing your payout details.
          </p>

        </div>

        <StepButtons
          onPrevious={previousPage}
          onNext={continueNext}
          previousText="Back"
          nextText="Choose Payout Method"
        />

      </div>
    </FormCard>
  );
}

export default Step5;