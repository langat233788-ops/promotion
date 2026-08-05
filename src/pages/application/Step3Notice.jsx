import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  getApplicationById,
  updateApplication,
} from "../../features/application/applicationService";

import { useApplication } from "../../features/application/ApplicationContext";

function Step3Notice() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const application = await getApplicationById(applicationId);

        setAccepted(application.accepted_notice || false);
      } catch (error) {
        console.error(error);
        alert("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

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
      alert(error.message);
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
        description="Please read the notice carefully before proceeding."
        step={3}
        totalSteps={10}
      />

      <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">
        <h2 className="mb-4 text-xl font-bold text-yellow-800">
          Important Notice
        </h2>

        <p className="leading-8 text-gray-700">
          Before proceeding, please note that participation in this
          promotion requires payment of a mandatory activation fee.
          The activation fee is required to activate and process your
          application.
        </p>

        <p className="mt-5 leading-8 text-gray-700">
          If, for any reason, your application is not processed,
          your activation fee will be refunded through the original
          payment method or another approved refund method.
        </p>

        <p className="mt-5 leading-8 text-gray-700">
          Payment of the activation fee does not guarantee approval.
          Every application is reviewed according to the promotion
          requirements and terms and conditions.
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
          I have read and understood the above notice and I agree to
          proceed with my application.
        </span>
      </label>

      <StepButtons
        onPrevious={previousPage}
        onNext={handleContinue}
        previousText="Back"
        nextText={
          loading
            ? "Saving..."
            : "I Understand & Continue"
        }
        loading={loading}
      />
    </FormCard>
  );
}

export default Step3Notice;