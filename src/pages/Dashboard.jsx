import { useAuth } from "../features/auth/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="mb-4 text-4xl font-bold">
          United Nations Promotional Award
        </h1>

        <p className="leading-8 text-blue-100">
          Welcome to the United Nations Promotional Award
          application portal. This initiative is designed to
          provide eligible applicants with access to promotional
          funding opportunities intended to support economic
          empowerment, entrepreneurship, education, innovation,
          community development, and other qualifying activities.
          Applicants are encouraged to complete all application
          steps accurately and monitor their application status
          through the dashboard. All activation and transaction
          fees paid during the application process are refundable
          if the application is not processed, in accordance with
          the program's refund policy.
        </p>

        <div className="mt-6 rounded-xl bg-white/10 p-4">
          <p className="text-sm text-blue-100">
            Logged in as
          </p>

          <p className="text-lg font-semibold">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="text-gray-500">
            Applications
          </h2>

          <p className="mt-3 text-4xl font-bold text-blue-700">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="text-gray-500">
            Under Review
          </h2>

          <p className="mt-3 text-4xl font-bold text-yellow-500">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="text-gray-500">
            Approved
          </h2>

          <p className="mt-3 text-4xl font-bold text-green-600">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
          <h2 className="text-gray-500">
            Payments Made
          </h2>

          <p className="mt-3 text-4xl font-bold text-purple-600">
            0
          </p>
        </div>
      </div>

      {/* Latest Application */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-bold">
          Latest Application
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Reference Number
            </p>

            <p className="font-semibold">
              No application yet
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="font-semibold text-yellow-600">
              —
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Promotion Amount
            </p>

            <p className="font-semibold">
              KES 0
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Updated
            </p>

            <p className="font-semibold">
              —
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Recent Activity
        </h2>

        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          Your recent application activities and status updates
          will appear here as you progress through the United
          Nations Promotional Award application process.
        </div>
      </div>
    </div>
  );
}

export default Dashboard;