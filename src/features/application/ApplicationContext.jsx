import { createContext, useContext, useState } from "react";
import {
  createApplication,
  getApplications,
  getDraftApplication,
  updateApplicationStep,
} from "./applicationService";

const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [draftApplication, setDraftApplication] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Load all applications for the logged-in user
   */
  async function loadApplications(userId) {
    setLoading(true);

    try {
      const data = await getApplications(userId);

      setApplications(data);

      const draft =
        data.find((app) => app.status === "draft") || null;

      setDraftApplication(draft);
      setCurrentApplication(draft);

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Create a new draft application
   */
  async function createNewApplication(userId) {
    try {
      const application = await createApplication(userId);

      setApplications((prev) => [
        application,
        ...prev,
      ]);

      setDraftApplication(application);
      setCurrentApplication(application);

      return application;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Load the user's current draft application
   */
  async function loadDraft(userId) {
    try {
      const draft = await getDraftApplication(userId);

      setDraftApplication(draft);
      setCurrentApplication(draft);

      return draft;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Refresh current application from database
   */
  async function refreshCurrentApplication(userId) {
    try {
      const draft = await getDraftApplication(userId);

      setCurrentApplication(draft);
      setDraftApplication(draft);

      return draft;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update current step
   */
  async function saveCurrentStep(applicationId, step) {
    try {
      const updated = await updateApplicationStep(
        applicationId,
        step
      );

      setCurrentApplication(updated);
      setDraftApplication(updated);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === updated.id ? updated : app
        )
      );

      return updated;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        draftApplication,
        currentApplication,
        loading,

        loadApplications,
        createNewApplication,
        loadDraft,
        refreshCurrentApplication,
        saveCurrentStep,

        setApplications,
        setDraftApplication,
        setCurrentApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplication must be used inside ApplicationProvider"
    );
  }

  return context;
}