import React from "react";

import { SubmissionWizardRouter } from "./modules/submission-wizard/components/SubmissionWizardRouter";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import InitialDataProvider from "./modules/submission-wizard/components/InitialDataProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MathJaxContext } from "better-react-mathjax";
import ContinueEditDataProvider from "./modules/submission-wizard/components/ContinueEditDataProvider";

const queryClient = new QueryClient();

function SubmissionWizardApp() {
  return (
    <ThemeProvider>
      <InitialDataProvider>
        <ContinueEditDataProvider>
          <QueryClientProvider client={queryClient}>
            <MathJaxContext
              config={{
                tex: {
                  inlineMath: [
                    ["$", "$"],
                    ["\\(", "\\)"],
                  ],
                },
              }}
            >
              <SubmissionWizardRouter />
            </MathJaxContext>
          </QueryClientProvider>
        </ContinueEditDataProvider>
      </InitialDataProvider>
    </ThemeProvider>
  );
}

export default SubmissionWizardApp;
