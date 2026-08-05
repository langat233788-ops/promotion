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

function PayoutDetails() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(false);

  const [method, setMethod] = useState("");

  const [form, setForm] = useState({
    recipient_name: "",
    payout_phone: "",
    bank_name: "",
    bank_branch: "",
    account_number: "",
  });

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const application = await getApplicationById(applicationId);

        setMethod(application.payout_method || "");

        setForm({
          recipient_name: application.recipient_name || "",
          payout_phone: application.payout_phone || "",
          bank_name: application.bank_name || "",
          bank_branch: application.bank_branch || "",
          account_number: application.account_number || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load payout details.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!form.recipient_name.trim()) {
      return "Recipient name is required.";
    }

    if (method === "mpesa" || method === "airtel") {
      if (!form.payout_phone.trim()) {
        return "Phone number is required.";
      }
    }

    if (method === "bank") {
      if (!form.bank_name.trim()) {
        return "Bank name is required.";
      }

      if (!form.bank_branch.trim()) {
        return "Bank branch is required.";
      }

      if (!form.account_number.trim()) {
        return "Account number is required.";
      }
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

      await updateApplication(applicationId, {
        recipient_name: form.recipient_name,
        payout_phone: form.payout_phone,
        bank_name: form.bank_name,
        bank_branch: form.bank_branch,
        account_number: form.account_number,
      });

      // Proceed to Step 6 (Payout Transaction Fee)
      await saveCurrentStep(applicationId, 8);

      navigate(`/apply/${applicationId}/step6`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/payout-method`);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading payout details...
      </div>
    );
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 7 - Payout Details"
        description="Provide the details where your promotion funds will be sent after successful processing."
        step={7}
        totalSteps={12}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <FormInput
          label="Recipient Name"
          name="recipient_name"
          value={form.recipient_name}
          onChange={handleChange}
          placeholder="Enter recipient's full name"
          required
        />

        {(method === "mpesa" || method === "airtel") && (
          <FormInput
            label={
              method === "mpesa"
                ? "M-Pesa Number"
                : "Airtel Money Number"
            }
            name="payout_phone"
            value={form.payout_phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX"
            required
          />
        )}

        {method === "bank" && (
          <>
            <FormInput
              label="Bank Name"
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              placeholder="e.g. KCB Bank"
              required
            />

            <FormInput
              label="Bank Branch"
              name="bank_branch"
              value={form.bank_branch}
              onChange={handleChange}
              placeholder="e.g. Kisumu Branch"
              required
            />

            <FormInput
              label="Account Number"
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
              placeholder="Enter account number"
              required
            />
          </>
        )}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="mb-2 font-semibold text-blue-700">
            Important
          </h3>

          <p className="text-sm leading-6 text-gray-700">
            Please ensure the payout details are correct.
            Approved promotion funds will be sent using
            the payout method you selected. Incorrect
            information may delay processing.
          </p>
        </div>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={
            loading
              ? "Saving..."
              : "Save & Continue"
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default PayoutDetails;