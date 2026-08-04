import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

import {
  getApplications,
} from "../features/application/applicationService";

function Payments() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadPayments() {
      try {
        const data = await getApplications(user.id);
        setApplications(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [user]);

  const totalActivation = applications
    .filter((app) => app.activation_fee_paid)
    .reduce(
      (sum, app) => sum + Number(app.activation_fee || 0),
      0
    );

  const totalPayout = applications.reduce(
    (sum, app) => sum + Number(app.payout_fee || 0),
    0
  );

  const totalPaid = totalActivation + totalPayout;

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 p-8 text-white shadow">

        <h1 className="text-3xl font-bold">
          Payments
        </h1>

        <p className="mt-3 text-purple-100">
          View your payment history, transaction status,
          and payment summaries for your United Nations
          Promotional Award applications.
        </p>

      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Activation Fees Paid
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-700">
            KES {totalActivation.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Transaction Fees
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-700">
            KES {totalPayout.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Total Paid
          </p>

          <h2 className="mt-3 text-3xl font-bold text-purple-700">
            KES {totalPaid.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* Payment History */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Payment History
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="px-4 py-3 text-left">
                  Reference
                </th>

                <th className="px-4 py-3 text-left">
                  Activation Fee
                </th>

                <th className="px-4 py-3 text-left">
                  Transaction Fee
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>
                            {applications.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
                  >
                    No payment records found.
                  </td>
                </tr>

              ) : (

                applications.map((application) => (

                  <tr
                    key={application.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-4 py-4 font-medium">
                      {application.reference_no || "-"}
                    </td>

                    <td className="px-4 py-4">
                      KES{" "}
                      {Number(
                        application.activation_fee || 0
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      KES{" "}
                      {Number(
                        application.payout_fee || 0
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">

                      {application.activation_fee_paid ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Paid
                        </span>

                      ) : (

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                          Pending
                        </span>

                      )}

                    </td>

                    <td className="px-4 py-4">
                      {application.updated_at
                        ? new Date(
                            application.updated_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Payment Policy */}

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6 shadow">

        <h2 className="mb-3 text-xl font-bold text-blue-700">
          Payment Policy
        </h2>

        <p className="leading-7 text-gray-700">
          Activation fees are required to process your
          application. If your application is not processed,
          eligible activation fees will be refunded according
          to the United Nations Promotional Award refund
          policy.
        </p>

      </div>

      {/* Receipts */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-2xl font-bold">
          Payment Receipts
        </h2>

        <div className="space-y-4">

          {applications.length === 0 ? (

            <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
              No receipts available.
            </div>

          ) : (

            applications.map((application) => (

              <div
                key={application.id}
                className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
              >

                <div>

                  <p className="font-semibold">
                    {application.reference_no}
                  </p>

                  <p className="text-sm text-gray-500">
                    Receipt generation will be available
                    after payment verification.
                  </p>

                </div>

                <button
                  disabled
                  className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2 font-semibold text-white"
                >
                  Download Receipt
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Payments;