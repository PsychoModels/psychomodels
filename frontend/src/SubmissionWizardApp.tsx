import React from "react";

import { Container } from "./modules/submission-wizard/components/Container";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import InitialDataProvider from "./modules/shared/components/InitialDataProvider";

function SubmissionWizardApp() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <ThemeProvider>
        <InitialDataProvider>
          <Container />
        </InitialDataProvider>
      </ThemeProvider>
    </div>
  );
}

export default SubmissionWizardApp;
