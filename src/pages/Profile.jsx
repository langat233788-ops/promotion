import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

import {
  getApplications,
} from "../features/application/applicationService";

function Profile() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    draft: 0,
    approved: 0,
  });

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      try {
        const applications = await getApplications(user.id);

        setStats({
          total: applications.length,
          submitted: applications.filter(
            (a) => a.status === "submitted"
          ).length,
          draft: applications.filter(
            (a) =>
              a.status &&
              a.status.toLowerCase() === "draft"
          ).length,
          approved: applications.filter(
            (a) => a.status === "approved"
          ).length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
      alert("Failed to sign out.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-slate-700 to-gray-900 p-8 text-white shadow">

        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="mt-3 text-gray-200">
          View your account information,
          application statistics and
          account settings.
        </p>

      </div>

      {/* Account Information */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Account Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <p className="font-semibold">
              {user?.email}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              User ID
            </p>

            <p className="font-semibold">
              USER-{user?.id?.substring(0, 8).toUpperCase()}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Email Verified
            </p>

            <p className="font-semibold text-green-700">
              {user?.email_confirmed_at
                ? "Verified"
                : "Not Verified"}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Account Created
            </p>

            <p className="font-semibold">
              {user?.created_at
                ? new Date(
                    user.created_at
                  ).toLocaleDateString()
                : "-"}
            </p>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Applications
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-700">
            {stats.total}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Submitted
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-700">
            {stats.submitted}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Draft
          </p>

          <h2 className="mt-3 text-3xl font-bold text-yellow-600">
            {stats.draft}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Approved
          </p>

          <h2 className="mt-3 text-3xl font-bold text-purple-700">
            {stats.approved}
          </h2>

        </div>

      </div>

      {/* Security */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-2xl font-bold">
          Security
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-semibold text-white"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Sign Out
          </button>

        </div>

      </div>

      {/* Account Notice */}

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6 shadow">

        <h2 className="mb-3 text-xl font-bold text-blue-700">
          Account Notice
        </h2>

        <p className="leading-7 text-gray-700">
          This account is used to manage your
          <strong> United Nations Promotional Award </strong>
          applications. Your email address is linked to all of
          your application records and payment history.
        </p>

        <p className="mt-4 leading-7 text-gray-700">
          Some information contained in applications that have
          already been submitted may not be editable after the
          review process has started.
        </p>

      </div>

      {/* Support */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-5 text-2xl font-bold">
          Need Assistance?
        </h2>

        <p className="mb-6 text-gray-700">
          If you need help with your application, payment or
          account, our support team is available to assist you.
        </p>

        <a
          href="https://wa.me/254790469550"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Chat on WhatsApp
        </a>

      </div>

    </div>
  );
}

export default Profile;