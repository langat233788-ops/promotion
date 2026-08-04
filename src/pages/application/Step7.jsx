import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  getApplicationById,
  submitApplication,
} from "../../features/application/applicationService";

function Step7() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const [loading, setLoading] = useState(false);

  const [application, setApplication] = useState(null);

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const data = await getApplicationById(
          applicationId
        );

        setApplication(data);
      } catch (error) {
        console.error(error);

        alert("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!accepted) {
      alert(
        "Please confirm that your information is correct."
      );
      return;
    }

    try {
      setLoading(true);

      await submitApplication(applicationId);

      alert("Application submitted successfully.");

      navigate(
        `/apply/${applicationId}/success`
      );
    } catch (error) {
      console.error(error);

      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(
      `/apply/${applicationId}/step6`
    );
  }

  if (!application) {
    return (
      <FormCard>
        <p>Loading...</p>
      </FormCard>
    );
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 7 - Review & Submit"
        description="Review your application before submitting it for processing."
        step={7}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Personal Information */}

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-bold">
            Personal Information
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <p><strong>First Name:</strong> {application.first_name}</p>
            <p><strong>Last Name:</strong> {application.last_name}</p>
            <p><strong>Gender:</strong> {application.gender}</p>
            <p><strong>Date of Birth:</strong> {application.date_of_birth}</p>
            <p><strong>Phone:</strong> {application.phone}</p>
            <p><strong>National ID:</strong> {application.national_id}</p>
            <p><strong>Occupation:</strong> {application.occupation}</p>
            <p><strong>Marital Status:</strong> {application.marital_status}</p>
            <p><strong>Country:</strong> {application.country}</p>
            <p><strong>County:</strong> {application.county}</p>
            <p><strong>City:</strong> {application.city}</p>
            <p><strong>Postal Address:</strong> {application.postal_address || "-"}</p>
          </div>
        </div>

        {/* Additional Information */}

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-bold">
            Additional Information
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <p><strong>Education Level:</strong> {application.education_level}</p>
            <p><strong>Employment Status:</strong> {application.employment_status}</p>
            <p><strong>Monthly Income:</strong> {application.monthly_income}</p>
            <p><strong>Source of Income:</strong> {application.source_of_income}</p>
            <p><strong>Residential Address:</strong> {application.residential_address}</p>
          </div>
        </div>

        {/* Promotion Details */}

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-bold">
            Promotion Details
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Promotion Amount:</strong> KES{" "}
              {Number(application.promotion_amount || 0).toLocaleString()}
            </p>

            <p>
              <strong>Activation Fee:</strong> KES{" "}
              {Number(application.activation_fee || 0).toLocaleString()}
            </p>

            <p>
              <strong>Activation Fee Paid:</strong>{" "}
              {application.activation_fee_paid ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>

        {/* Payout Details */}

        <div className="rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-bold">
            Payout Details
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Payout Method:</strong>{" "}
              {application.payout_method}
            </p>

            <p>
              <strong>Transaction Fee:</strong> KES{" "}
              {Number(application.payout_fee || 0).toLocaleString()}
            </p>

            <p>
              <strong>Transaction Fee Paid:</strong>{" "}
              {application.payout_fee_paid ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>

        {/* Declaration */}

        <label className="flex items-start gap-3 rounded-xl border bg-gray-50 p-5">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-5 w-5"
          />

          <span className="text-gray-700">
            I confirm that all the information I have provided is
            true and accurate. I understand that providing false
            information may result in my application being rejected.
          </span>
        </label>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText={
            loading
              ? "Submitting..."
              : "Submit Application"
          }
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default Step7;