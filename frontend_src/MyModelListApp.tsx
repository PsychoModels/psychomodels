import React from "react";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyModelList } from "./modules/my-model-list/components/MyModelList";
import DataProvider from "./modules/my-model-list/components/DataProvider";

const queryClient = new QueryClient();

const MyModelListApp = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <DataProvider>
          {({ draftModels, submittedModels }) => {
            return (
              <MyModelList
                draftModels={draftModels}
                submittedModels={submittedModels}
              />
            );
          }}
        </DataProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default MyModelListApp;
