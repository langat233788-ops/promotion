import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

import {
  getApplications,
} from "../features/application/applicationService";

function Notifications() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadNotifications() {
      try {
        const applications = await getApplications(user.id);

        const items = [];

        applications.forEach((app) => {

          items.push({
            id: `${app.id}-created`,
            title: "Application Created",
            message: `Your application ${app.reference_no || ""} has been created successfully.`,
            type: "info",
            date: app.created_at,
          });

          if (app.activation_fee_paid) {
            items.push({
              id: `${app.id}-payment`,
              title: "Activation Fee Received",
              message:
                "Your activation fee has been received successfully.",
              type: "success",
              date: app.activation_payment_date || app.updated_at,
            });
          } else {
            items.push({
              id: `${app.id}-pending-payment`,
              title: "Activation Fee Pending",
              message:
                "Your activation fee is still pending. Complete payment to continue your application.",
              type: "warning",
              date: app.updated_at,
            });
          }

          if (app.status === "submitted") {
            items.push({
              id: `${app.id}-submitted`,
              title: "Application Submitted",
              message:
                "Your application has been submitted for review.",
              type: "success",
              date: app.submitted_at,
            });
          } else {
            items.push({
              id: `${app.id}-draft`,
              title: "Application In Progress",
              message:
                "Continue completing your application to submit it for review.",
              type: "info",
              date: app.updated_at,
            });
          }

        });

        items.sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        setNotifications(items);

      } catch (error) {
        console.error(error);
        alert("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();

  }, [user]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading notifications...
      </div>
    );
  }

  const unread = notifications.filter(
    (item) => item.type === "warning"
  ).length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-700 p-8 text-white shadow">

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="mt-3 text-blue-100">
          Stay updated with your application progress,
          payment confirmations and important announcements.
        </p>

      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Total Notifications
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-700">
            {notifications.length}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Unread Alerts
          </p>

          <h2 className="mt-3 text-3xl font-bold text-yellow-600">
            {unread}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Important Notices
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {
              notifications.filter(
                (item) => item.type === "warning"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* Notifications */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Recent Notifications
        </h2>

        <div className="space-y-4">
                    {notifications.length === 0 ? (

            <div className="rounded-lg border border-dashed p-10 text-center text-gray-500">
              You don't have any notifications yet.
            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className="rounded-xl border p-5 transition hover:shadow-md"
              >

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                  <div>

                    <div className="mb-2 flex items-center gap-3">

                      <h3 className="text-lg font-bold">
                        {notification.title}
                      </h3>

                      {notification.type === "success" && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Success
                        </span>
                      )}

                      {notification.type === "info" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Information
                        </span>
                      )}

                      {notification.type === "warning" && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Action Required
                        </span>
                      )}

                    </div>

                    <p className="text-gray-700">
                      {notification.message}
                    </p>

                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {notification.date
                      ? new Date(
                          notification.date
                        ).toLocaleString()
                      : "-"}
                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* Information */}

      <div className="rounded-xl border-l-4 border-indigo-600 bg-indigo-50 p-6 shadow">

        <h2 className="mb-3 text-xl font-bold text-indigo-700">
          Notification Center
        </h2>

        <p className="leading-7 text-gray-700">
          Notifications keep you informed about important
          updates to your application, payment confirmations,
          review progress, administrator actions and any
          additional information that may require your
          attention. Please check this page regularly for the
          latest updates regarding your application.
        </p>

      </div>

    </div>
  );
}

export default Notifications;