import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import FormInput from "../../components/application/FormInput";
import FormSelect from "../../components/application/FormSelect";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import {
  getApplicationById,
  saveStep2,
} from "../../features/application/applicationService";

function Step2() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    education_level: "",
    employment_status: "",
    monthly_income: "",
    source_of_income: "",
    residential_address: "",
  });

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const data = await getApplicationById(applicationId);

        setForm({
          education_level: data.education_level || "",
          employment_status: data.employment_status || "",
          monthly_income: data.monthly_income || "",
          source_of_income: data.source_of_income || "",
          residential_address:
            data.residential_address || "",
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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!form.education_level)
      return "Education Level is required.";

    if (!form.employment_status)
      return "Employment Status is required.";

    if (!form.monthly_income)
      return "Monthly Income is required.";

    if (!form.source_of_income.trim())
      return "Source of Income is required.";

    if (!form.residential_address.trim())
      return "Residential Address is required.";

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

      await saveStep2(applicationId, form);

      navigate(`/apply/${applicationId}/step3-notice`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/step1`);
  }

  return (
    <FormCard>
      <StepHeader
        title="Step 2 - Additional Information"
        description="Provide your additional information."
        step={2}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormSelect
            label="Education Level"
            name="education_level"
            value={form.education_level}
            onChange={handleChange}
            required
            options={[
              "Primary",
              "Secondary",
              "Certificate",
              "Diploma",
              "Degree",
              "Masters",
              "PhD",
            ]}
          />

          <FormSelect
            label="Employment Status"
            name="employment_status"
            value={form.employment_status}
            onChange={handleChange}
            required
            options={[
              "Employed",
              "Self Employed",
              "Business Owner",
              "Student",
              "Unemployed",
              "Retired",
            ]}
          />

          <FormSelect
            label="Monthly Income"
            name="monthly_income"
            value={form.monthly_income}
            onChange={handleChange}
            required
            options={[
              "Below KES 20,000",
              "KES 20,000 - 50,000",
              "KES 50,001 - 100,000",
              "Above KES 100,000",
            ]}
          />

          <FormInput
            label="Source of Income"
            name="source_of_income"
            value={form.source_of_income}
            onChange={handleChange}
            placeholder="e.g. Salary, Business, Farming"
            required
          />
        </div>

        <FormInput
          label="Residential Address"
          name="residential_address"
          value={form.residential_address}
          onChange={handleChange}
          placeholder="Enter your residential address"
          required
        />

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

export default Step2;