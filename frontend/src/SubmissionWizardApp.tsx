import React from "react";

import { SubmissionWizardContainer } from "./modules/submission-wizard/components/SubmissionWizardContainer";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import InitialDataProvider from "./modules/shared/components/InitialDataProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function SubmissionWizardApp() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <ThemeProvider>
        <InitialDataProvider>
          <QueryClientProvider client={queryClient}>
            <SubmissionWizardContainer />
          </QueryClientProvider>
        </InitialDataProvider>
      </ThemeProvider>
    </div>
  );
}

export default SubmissionWizardApp;
