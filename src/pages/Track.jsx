import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

import {
  getApplications,
} from "../features/application/applicationService";

function Track() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function loadApplication() {
      try {
        const applications = await getApplications(user.id);

        if (applications.length > 0) {
          setApplication(applications[0]);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        <h1 className="text-2xl font-bold">
          Track Application
        </h1>

        <p className="mt-4 text-gray-500">
          You have not submitted any applications yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">
          Track Application
        </h1>

        <p className="mt-3 text-blue-100">
          Monitor the progress of your United Nations
          Promotional Award application from submission
          through review and final decision.
        </p>
      </div>

      {/* Application Summary */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-2xl font-bold">
          Application Summary
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">
              Reference Number
            </p>

            <p className="font-semibold">
              {application.reference_no}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <span className="rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-700">
              {application.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Promotion Amount
            </p>

            <p className="font-semibold">
              KES {Number(application.promotion_amount || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Activation Fee
            </p>

            <p className="font-semibold">
              KES {Number(application.activation_fee || 0).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Progress Timeline */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-2xl font-bold">
          Application Progress
        </h2>

        <div className="space-y-4">

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>

            <div>
              <p className="font-semibold">
                Application Created
              </p>

              <p className="text-sm text-gray-500">
                Step 1 completed successfully.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>

            <div>
              <p className="font-semibold">
                Activation Fee Payment
              </p>

              <p className="text-sm text-gray-500">
                {application.activation_fee_paid
                  ? "Activation fee paid."
                  : "Awaiting payment."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              ⏳
            </div>

            <div>
              <p className="font-semibold">
                Application Review
              </p>

              <p className="text-sm text-gray-500">
                Waiting for administrator review.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Information */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-2xl font-bold">
          Payment Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">
              Activation Fee
            </p>

            <p className="font-semibold">
              KES {Number(application.activation_fee || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Activation Status
            </p>

            <p className="font-semibold">
              {application.activation_fee_paid ? "Paid" : "Pending"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payout Method
            </p>

            <p className="font-semibold">
              {application.payout_method || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payout Transaction Fee
            </p>

            <p className="font-semibold">
              KES {Number(application.payout_fee || 0).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Applicant Details */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-2xl font-bold">
          Applicant Details
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="font-semibold">
              {application.first_name} {application.last_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone Number
            </p>

            <p className="font-semibold">
              {application.phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              County
            </p>

            <p className="font-semibold">
              {application.county}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Updated
            </p>

            <p className="font-semibold">
              {new Date(application.updated_at).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* Administrator Remarks */}

      <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 shadow">
        <h2 className="mb-3 text-xl font-bold text-blue-700">
          Administrator Remarks
        </h2>

        <p className="text-gray-700">
          Your application has been received successfully.
          You will receive a notification once the review
          process begins.
        </p>
      </div>

      {/* Refund Information */}

      <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-6 shadow">
        <h2 className="mb-3 text-xl font-bold text-green-700">
          Refund Information
        </h2>

        <p className="text-gray-700">
          If your application is not processed, all eligible
          activation and payout transaction fees will be refunded
          according to the program's refund policy.
        </p>
      </div>

    </div>
  );
}

export default Track;