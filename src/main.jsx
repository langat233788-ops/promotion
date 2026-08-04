import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./features/auth/AuthContext";
import { ApplicationProvider } from "./features/application/ApplicationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ApplicationProvider>
        <App />
      </ApplicationProvider>
    </AuthProvider>
  </StrictMode>
);