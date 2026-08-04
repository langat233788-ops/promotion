import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  getApplicationById,
  saveStep3,
} from "../../features/application/applicationService";

import { useApplication } from "../../features/application/ApplicationContext";

function Step3Package() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    promotion_amount: "",
    activation_fee: 0,
  });

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const data = await getApplicationById(applicationId);

        const amount = Number(data.promotion_amount || 5000);

        setForm({
          promotion_amount: amount,
          activation_fee: amount * 0.1,
        });
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

  function handleChange(e) {
    const value = e.target.value;

    setForm({
      promotion_amount: value,
      activation_fee: value ? Number(value) * 0.1 : 0,
    });
  }

  function validateForm() {
    const amount = Number(form.promotion_amount);

    if (isNaN(amount)) {
      return "Enter a valid promotion amount.";
    }

    if (amount < 5000 || amount > 300000) {
      return "Promotion amount must be between KES 5,000 and KES 300,000.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setLoading(true);

      await saveStep3(applicationId, {
        promotion_amount: Number(form.promotion_amount),
        activation_fee: Number(form.activation_fee),
      });

      await saveCurrentStep(applicationId, 4);

      navigate(`/apply/${applicationId}/step4`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/step3-notice`);
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 3 - Select Promotion Package"
        description="Choose your preferred promotion amount. The activation fee is calculated automatically."
        step={3}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div>
          <label className="mb-2 block font-semibold">
            Promotion Amount (KES)
          </label>

          <input
            type="number"
            min="5000"
            max="300000"
            step="1000"
            value={form.promotion_amount}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            required
          />

          <p className="mt-2 text-sm text-gray-500">
            Enter any amount between KES 5,000 and KES 300,000.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-blue-700">
            Promotion Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Promotion Amount</span>
              <span className="font-semibold">
                KES{" "}
                {Number(
                  form.promotion_amount || 0
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Activation Fee (10%)</span>
              <span className="font-semibold text-red-600">
                KES{" "}
                {Number(
                  form.activation_fee || 0
                ).toLocaleString()}
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Payable Now</span>
              <span className="text-green-700">
                KES{" "}
                {Number(
                  form.activation_fee || 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={loading ? "Saving..." : "Save & Continue"}
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step3Package;