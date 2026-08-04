import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Track from "../pages/Track";
import Payments from "../pages/Payments";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

// Application Pages
import Apply from "../pages/application/Apply";
import Step1 from "../pages/application/Step1";
import Step2 from "../pages/application/Step2";
import Step3Notice from "../pages/application/Step3Notice";
import Step3Package from "../pages/application/Step3Package";
import Step4 from "../pages/application/Step4";
import Step5 from "../pages/application/Step5";
import Step6 from "../pages/application/Step6";
import Step7 from "../pages/application/Step7";
import PayoutMethod from "../pages/application/PayoutMethod";
import PayoutDetails from "../pages/application/PayoutDetails";
import Step8 from "../pages/application/Step8";
import Success from "../pages/application/Success";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Apply />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step1"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step1 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step2"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step2 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step3-notice"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step3Notice />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step3-package"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step3Package />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step4"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step4 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step5"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step5 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step6"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step6 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step7"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step7 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/payout-method"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PayoutMethod />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/payout-details"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PayoutDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/step8"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Step8 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:applicationId/success"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Success />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/track"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Track />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Payments />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Notifications />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;