import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  updateApplication,
} from "../../features/application/applicationService";

import {
  useApplication,
} from "../../features/application/ApplicationContext";

function Step3Notice() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue(e) {
    e.preventDefault();

    if (!accepted) {
      alert("Please accept the notice before continuing.");
      return;
    }

    try {
      setLoading(true);

      await updateApplication(applicationId, {
        accepted_notice: true,
      });

      await saveCurrentStep(applicationId, 4);

      navigate(`/apply/${applicationId}/step3-package`);
    } catch (error) {
      console.error(error);
      alert("Failed to continue.");
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/step2`);
  }

  return (
    <FormCard>

      <StepHeader
        title="Step 3 - Important Notice"
        description="Please read the following information carefully before proceeding."
        step={3}
        totalSteps={10}
      />

      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">

        <h2 className="mb-4 text-xl font-bold text-yellow-800">
          Important Notice
        </h2>

        <p className="leading-8 text-gray-700">
          Before proceeding, please note that participation in this
          promotion is <strong>subject to payment of a mandatory
          activation fee</strong>. The activation fee is required to
          activate and process your application.
        </p>

        <p className="mt-5 leading-8 text-gray-700">
          If, for any reason, your application is
          <strong> not processed</strong>, the activation fee will be
          <strong> fully refunded</strong> using the original payment
          method or another approved refund method.
        </p>

        <p className="mt-5 leading-8 text-gray-700">
          Payment of the activation fee
          <strong> does not guarantee approval</strong>. Every
          application is reviewed according to the promotion's
          eligibility requirements and terms and conditions.
        </p>

      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3">

        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-5 w-5"
        />

        <span className="text-gray-700">
          I have read and understood this notice and I agree to
          proceed with my application.
        </span>

      </label>

      <StepButtons
        onPrevious={previousPage}
        onNext={handleContinue}
        previousText="Back"
        nextText="I Understand & Continue"
        loading={loading}
      />

    </FormCard>
  );
}

export default Step3Notice;