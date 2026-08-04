import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useApplication } from "../../features/application/ApplicationContext";

function Apply() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    applications,
    draftApplication,
    loadApplications,
    createNewApplication,
  } = useApplication();

  useEffect(() => {
    if (user) {
      loadApplications(user.id);
    }
  }, [user]);

  async function handleNewApplication() {
    try {
      const application = await createNewApplication(user.id);

      if (application) {
        navigate(`/apply/${application.id}/step1`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function continueApplication() {
    if (!draftApplication) return;

    navigate(
      `/apply/${draftApplication.id}/step${draftApplication.current_step}`
    );
  }

  function openApplication(application) {
    if (application.status === "draft") {
      navigate(
        `/apply/${application.id}/step${application.current_step}`
      );
    } else {
      navigate("/track");
    }
  }

  function badgeColor(status) {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700";

      case "submitted":
        return "bg-blue-100 text-blue-700";

      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">
          Promotion Applications
        </h1>

        <p className="mt-3 text-lg text-blue-100">
          Create, continue and track all your promotion applications.
        </p>

        <button
          onClick={handleNewApplication}
          className="mt-8 rounded-xl bg-white px-8 py-3 font-semibold text-blue-700 hover:bg-gray-100"
        >
          + New Application
        </button>
      </div>

      {/* Draft */}

      {draftApplication && (
        <div className="rounded-2xl border-l-8 border-yellow-500 bg-yellow-50 p-6 shadow">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Continue Draft
              </h2>

              <p className="mt-2">
                Reference:
                <span className="ml-2 font-semibold">
                  {draftApplication.reference_no}
                </span>
              </p>

              <p className="mt-1">
                Step {draftApplication.current_step} of 10
              </p>
            </div>

            <button
              onClick={continueApplication}
              className="rounded-xl bg-yellow-500 px-8 py-3 font-semibold text-white hover:bg-yellow-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Applications */}

      <div>
        <h2 className="mb-6 text-3xl font-bold">
          My Applications
        </h2>

        {applications.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="text-gray-500">
              You haven't created any applications yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl bg-white p-6 shadow transition hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-700">
                    {application.reference_no}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="mt-6 space-y-2 text-gray-700">
                  <p>
                    <strong>Current Step:</strong>{" "}
                    {application.current_step} / 10
                  </p>

                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(
                      application.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => openApplication(application)}
                  className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {application.status === "draft"
                    ? "Continue"
                    : application.status === "submitted"
                    ? "Track"
                    : "View"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Apply;