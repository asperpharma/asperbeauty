import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";
import { logIntegrationHealth, validateRequiredEnvVars } from "./lib/integrationHealth";

// Validate environment configuration
validateRequiredEnvVars();

// Log integration health in development
logIntegrationHealth();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);