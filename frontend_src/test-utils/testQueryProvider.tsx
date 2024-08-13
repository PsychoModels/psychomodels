import { render } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests to ensure predictable failures
      },
    },
  });

// A helper function to render the component wrapped in QueryClientProvider
export const renderWithQueryClient = (children: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>,
  );
};

export const queryClientWrapper = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};
