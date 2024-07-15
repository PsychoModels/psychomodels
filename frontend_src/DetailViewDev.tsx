import React from "react";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import InitialDataProvider from "./modules/shared/components/InitialDataProvider";
import { DetailViewDevContent } from "./modules/dev/DetailViewDevContent.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DetailViewDev = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <InitialDataProvider>
        <QueryClientProvider client={queryClient}>
          <DetailViewDevContent />
        </QueryClientProvider>
      </InitialDataProvider>
    </ThemeProvider>
  );
};

export default DetailViewDev;
