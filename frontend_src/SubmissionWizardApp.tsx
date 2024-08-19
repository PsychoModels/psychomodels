import React from "react";

import { SubmissionWizardRouter } from "./modules/submission-wizard/components/SubmissionWizardRouter";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import InitialDataProvider from "./modules/shared/components/InitialDataProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MathJaxContext } from "better-react-mathjax";

const queryClient = new QueryClient();

function SubmissionWizardApp() {
  return (
    <ThemeProvider>
      <InitialDataProvider>
        <QueryClientProvider client={queryClient}>
          <MathJaxContext>
            <SubmissionWizardRouter />
          </MathJaxContext>
        </QueryClientProvider>
      </InitialDataProvider>
    </ThemeProvider>
  );
}

export default SubmissionWizardApp;
