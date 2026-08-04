import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormCard from "../../components/application/FormCard";

import {
  getApplicationById,
} from "../../features/application/applicationService";

function Success() {
  const navigate = useNavigate();

  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplicationById(applicationId);

        setApplication(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load application.");
      }
    }

    loadApplication();
  }, [applicationId]);

  if (!application) {
    return (
      <FormCard>
        <p>Loading...</p>
      </FormCard>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I have submitted my promotion application.

Reference Number: ${application.reference_no}

I need assistance.`
  );

  function goDashboard() {
    navigate("/dashboard");
  }

  function goTrack() {
    navigate("/track");
  }

  return (
    <FormCard>
      <div className="mx-auto max-w-3xl text-center">

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-green-700">
          Application Submitted Successfully
        </h1>

        <p className="mb-10 text-lg text-gray-600">
          Thank you. Your promotion application has been
          submitted successfully and is awaiting review by
          our administration team.
        </p>

        {/* Application Details */}

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">
            Application Details
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span className="font-medium text-gray-600">
                Reference Number
              </span>

              <span className="font-bold">
                {application.reference_no}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="font-medium text-gray-600">
                Status
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {application.status}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="font-medium text-gray-600">
                Promotion Amount
              </span>

              <span className="font-semibold">
                KES{" "}
                {Number(
                  application.promotion_amount || 0
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="font-medium text-gray-600">
                Submitted On
              </span>

              <span>
                {application.submitted_at
                  ? new Date(
                      application.submitted_at
                    ).toLocaleString()
                  : "-"}
              </span>
            </div>

          </div>

        </div>

        {/* What Happens Next */}

        <div className="mt-8 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-6 text-left">

          <h3 className="mb-3 text-xl font-bold text-blue-700">
            What Happens Next?
          </h3>

          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Your application will be reviewed by our
              administration team.
            </li>

            <li>
              You will receive notifications whenever your
              application status changes.
            </li>

            <li>
              If your application is approved, processing
              will begin immediately.
            </li>

            <li>
              If your application is not processed, both
              your activation fee and payout transaction
              fee will be refunded in accordance with our
              refund policy.
            </li>
          </ul>

        </div>
                {/* Action Buttons */}

        <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">

          <button
            onClick={goDashboard}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Dashboard
          </button>

          <button
            onClick={goTrack}
            className="rounded-xl border border-gray-300 px-8 py-3 font-semibold transition hover:bg-gray-100"
          >
            Track Application
          </button>

          <a
            href={`https://wa.me/254790469550?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-green-700"
          >
            💬 Chat on WhatsApp
          </a>

        </div>

        <p className="mt-8 text-sm text-gray-500">
          Keep your reference number safe as it will be required
          whenever you contact support or track the progress of
          your application.
        </p>

      </div>
    </FormCard>
  );
}

export default Success;