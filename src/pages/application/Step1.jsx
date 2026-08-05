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

import { useAuth } from "../../features/auth/AuthContext";

import {
  getApplicationById,
  saveStep1,
} from "../../features/application/applicationService";

function Step1() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    country: "",
    national_id: "",
    phone: "",
    occupation: "",
    marital_status: "",
    county: "",
    city: "",
    postal_address: "",
  });

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);

        const data = await getApplicationById(applicationId);

        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          country: data.country || "",
          national_id: data.national_id || "",
          phone: data.phone || "",
          occupation: data.occupation || "",
          marital_status: data.marital_status || "",
          county: data.county || "",
          city: data.city || "",
          postal_address: data.postal_address || "",
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
    if (!form.first_name.trim())
      return "First Name is required.";

    if (!form.last_name.trim())
      return "Last Name is required.";

    if (!form.gender)
      return "Gender is required.";

    if (!form.date_of_birth)
      return "Date of Birth is required.";

    if (!form.country.trim())
      return "Country is required.";

    if (!form.national_id.trim())
      return "National ID / Passport is required.";

    if (!form.phone.trim())
      return "Phone Number is required.";

    if (!form.occupation.trim())
      return "Occupation is required.";

    if (!form.marital_status)
      return "Marital Status is required.";

    if (!form.county.trim())
      return "County / State is required.";

    if (!form.city.trim())
      return "City / Town is required.";

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

      await saveStep1(applicationId, form);

      navigate(`/apply/${applicationId}/step2`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate("/apply");
  }

  return (
    <FormCard>
      <StepHeader
        title="Step 1 - Personal Information"
        description="Fill in your personal information."
        step={1}
        totalSteps={10}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            options={[
              "Male",
              "Female",
              "Other",
            ]}
          />

          <FormInput
            label="Date of Birth"
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />

          <FormInput
            label="National ID / Passport"
            name="national_id"
            value={form.national_id}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email Address"
            value={user?.email || ""}
            readOnly
          />

          <FormInput
            label="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Marital Status"
            name="marital_status"
            value={form.marital_status}
            onChange={handleChange}
            required
            options={[
              "Single",
              "Married",
              "Divorced",
              "Widowed",
            ]}
          />

          <FormInput
            label="County / State"
            name="county"
            value={form.county}
            onChange={handleChange}
            required
          />

          <FormInput
            label="City / Town"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          label="Postal Address"
          name="postal_address"
          value={form.postal_address}
          onChange={handleChange}
          placeholder="Optional"
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

export default Step1;