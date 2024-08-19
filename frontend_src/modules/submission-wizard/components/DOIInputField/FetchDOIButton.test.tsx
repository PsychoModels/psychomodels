import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { FetchDOIButton } from "./FetchDOIButton.tsx";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider";
import { server } from "../../../../setup-vitest.ts";
import { delay, http, HttpResponse } from "msw";

describe("FetchFromDOIButton", () => {
  it("renders the button and is disabled when DOI is invalid", () => {
    // Invalid DOI value
    renderWithQueryClient(<FetchDOIButton doiValue="invalid-doi" />);

    const button = screen.getByRole("button", { name: /Get details/i });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // Button should be disabled for invalid DOI
  });

  it("enables the button when a valid DOI is provided", () => {
    // Valid DOI value
    renderWithQueryClient(<FetchDOIButton doiValue="10.1000/xyz123" />);

    const button = screen.getByRole("button", { name: /Get details/i });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled(); // Button should be enabled for valid DOI
  });

  it("load the publication data when the button is clicked", async () => {
    let requestFired = false;
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", () => {
        requestFired = true;
        return new HttpResponse(
          "Baicker, K. (2006). The labor market effects of rising health insurance. Journal of Labor Economics, 24(3), 609-634. http://dx.doi.org/10.1086/505049 ",
          {
            status: 200,
          },
        );
      }),
    );

    renderWithQueryClient(<FetchDOIButton doiValue="10.1000/xyz123" />);

    const button = screen.getByRole("button", { name: /Get details/i });

    expect(button).toBeEnabled();

    fireEvent.click(button);

    await waitFor(() => expect(requestFired).toBe(true));
  });

  it("shows loading state when refetching or loading", async () => {
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", async () => {
        await delay("infinite");
      }),
    );

    renderWithQueryClient(<FetchDOIButton doiValue="10.1000/xyz123" />);

    const button = screen.getByRole("button", { name: /Get details/i });

    expect(button).toBeEnabled();

    fireEvent.click(button);

    await waitFor(() => {
      const buttonSpinner = button.querySelector("span.cursor-wait");
      expect(buttonSpinner).toBeInTheDocument();
    });
  });
});
