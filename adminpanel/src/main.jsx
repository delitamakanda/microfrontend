import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nano/theme.css";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary, LoadError } from "./components/core/LoadError.jsx";

const root = createRoot(document.getElementById("root"));

// App and AuthProvider depend on the federated remote (storefrontApp/*). A static
// import cannot be caught: load them dynamically so a failure shows a fallback
// screen instead of an empty root.
async function bootstrap() {
  try {
    const [{ default: App }, authModule] = await Promise.all([
      import("./App.jsx"),
      import("storefrontApp/AuthProvider"),
    ]);
    // A dynamic remote import may expose the named export directly or under `default`.
    const AuthProvider =
      authModule.AuthProvider ?? authModule.default?.AuthProvider ?? authModule.default;
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error("Unable to load the storefront remote:", error);
    root.render(<LoadError />);
  }
}

bootstrap();
