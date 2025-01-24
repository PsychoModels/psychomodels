import React from "react";

import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountRouter } from "./modules/account/components/AccountRouter";
import InitialDataProvider from "./modules/submission-wizard/components/InitialDataProvider";

const queryClient = new QueryClient();

function AccountApp() {
  return (
    <ThemeProvider>
      <InitialDataProvider>
        <QueryClientProvider client={queryClient}>
          <AccountRouter />
        </QueryClientProvider>
      </InitialDataProvider>
    </ThemeProvider>
  );
}

export default AccountApp;
