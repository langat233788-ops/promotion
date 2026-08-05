import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";
import StepHeader from "../../components/application/StepHeader";
import StepButtons from "../../components/application/StepButtons";

import { useApplication } from "../../features/application/ApplicationContext";

import {
  getApplicationById,
  updateApplication,
} from "../../features/application/applicationService";

function PayoutMethod() {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const { saveCurrentStep } = useApplication();

  const [loading, setLoading] = useState(false);

  const [promotionAmount, setPromotionAmount] = useState(0);

  const [selectedMethod, setSelectedMethod] = useState("");

  const [fees, setFees] = useState({
    mpesa: 0,
    airtel: 0,
    bank: 0,
  });

  useEffect(() => {
    async function loadApplication() {
      try {
        const application = await getApplicationById(applicationId);

        const amount = Number(application.promotion_amount || 0);

        setPromotionAmount(amount);

        setFees({
          mpesa: amount * 0.15,
          airtel: amount * 0.175,
          bank: amount * 0.2,
        });

        if (application.payout_method) {
          setSelectedMethod(application.payout_method);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load application.");
      }
    }

    loadApplication();
  }, [applicationId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedMethod) {
      alert("Please choose a payout method.");
      return;
    }

    try {
      setLoading(true);

      let fee = 0;

      switch (selectedMethod) {
        case "mpesa":
          fee = fees.mpesa;
          break;

        case "airtel":
          fee = fees.airtel;
          break;

        case "bank":
          fee = fees.bank;
          break;

        default:
          fee = 0;
      }

      await updateApplication(applicationId, {
        payout_method: selectedMethod,
        payout_fee: fee,
      });

      // Move to Payout Details
      await saveCurrentStep(applicationId, 7);

      navigate(`/apply/${applicationId}/payout-details`);
    } catch (error) {
      console.error(error);
      alert("Failed to save payout method.");
    } finally {
      setLoading(false);
    }
  }

  function previousPage() {
    navigate(`/apply/${applicationId}/step5`);
  }
    return (
    <FormCard>
      <StepHeader
        title="Step 6 - Choose Payout Method"
        description="Select how you would like to receive your promotion funds."
        step={6}
        totalSteps={12}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Promotion Amount */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Promotion Amount
            </span>

            <span className="text-2xl font-bold text-blue-700">
              KES {promotionAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Choose Method */}

        <div className="space-y-5">

          {/* M-Pesa */}

          <div
            onClick={() => setSelectedMethod("mpesa")}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedMethod === "mpesa"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  📱 M-Pesa
                </h2>

                <p className="mt-2 text-gray-600">
                  Transaction Fee: <strong>15%</strong>
                </p>

                <p className="mt-1 text-lg font-semibold">
                  KES {fees.mpesa.toLocaleString()}
                </p>
              </div>

              {selectedMethod === "mpesa" && (
                <div className="text-3xl text-blue-600">
                  ✓
                </div>
              )}

            </div>
          </div>

          {/* Airtel */}

          <div
            onClick={() => setSelectedMethod("airtel")}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedMethod === "airtel"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  📱 Airtel Money
                </h2>

                <p className="mt-2 text-gray-600">
                  Transaction Fee: <strong>17.5%</strong>
                </p>

                <p className="mt-1 text-lg font-semibold">
                  KES {fees.airtel.toLocaleString()}
                </p>
              </div>

              {selectedMethod === "airtel" && (
                <div className="text-3xl text-blue-600">
                  ✓
                </div>
              )}

            </div>
          </div>

          {/* Bank */}

          <div
            onClick={() => setSelectedMethod("bank")}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedMethod === "bank"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  🏦 Bank Account
                </h2>

                <p className="mt-2 text-gray-600">
                  Transaction Fee: <strong>20%</strong>
                </p>

                <p className="mt-1 text-lg font-semibold">
                  KES {fees.bank.toLocaleString()}
                </p>
              </div>

              {selectedMethod === "bank" && (
                <div className="text-3xl text-blue-600">
                  ✓
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Refund Notice */}

        <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5">
          <h3 className="mb-2 font-semibold text-yellow-700">
            Important
          </h3>

          <p className="text-sm text-gray-700">
            The transaction fee will be paid after you provide your payout
            details. This fee is <strong>fully refundable</strong> if your
            application is not processed.
          </p>
        </div>

        <StepButtons
          onPrevious={previousPage}
          onNext={handleSubmit}
          previousText="Back"
          nextText="Continue"
          loading={loading}
        />
      </form>
    </FormCard>
  );
}

export default PayoutMethod;