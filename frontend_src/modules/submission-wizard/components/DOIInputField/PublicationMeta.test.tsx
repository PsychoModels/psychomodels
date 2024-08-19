import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { PublicationMeta } from "./PublicationMeta";
import "@testing-library/jest-dom";
import { renderWithQueryClient } from "../../../../test-utils/testQueryProvider.tsx";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";

describe("PublicationMeta", () => {
  const doiValue = "10.1000/xyz123";

  it("renders the publication data when a valid DOI is provided", async () => {
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", () => {
        return new HttpResponse(
          "Baicker, K. (2006). The labor market effects of rising health insurance. Journal of Labor Economics, 24(3), 609-634. http://dx.doi.org/10.1086/505049 ",
          {
            status: 200,
          },
        );
      }),
    );

    renderWithQueryClient(
      <PublicationMeta doiValue={doiValue} enabled={true}>
        {(publication) => <div>{publication}</div>}
      </PublicationMeta>,
    );

    await waitFor(() => {
      const publicationElement = screen.getByText(/Baicker/i);
      expect(publicationElement).toHaveTextContent(
        "Baicker, K. (2006). The labor market effects of rising health insurance. Journal of Labo",
      );
    });
  });

  it("shows a 404 error when the DOI is not found", async () => {
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", () => {
        return new HttpResponse(null, {
          status: 404,
        });
      }),
    );

    renderWithQueryClient(
      <PublicationMeta doiValue={doiValue} enabled={true}>
        {(publication) => <div>{publication}</div>}
      </PublicationMeta>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/DOI not found/i)).toBeInTheDocument();
    });
  });

  it("shows a general error when a network error occurs", async () => {
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(
      <PublicationMeta doiValue={doiValue} enabled={true}>
        {(publication) => <div>{publication}</div>}
      </PublicationMeta>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(
        screen.getByText(/Could not fetch publication details/i),
      ).toBeInTheDocument();
    });
  });

  it("hides the error when hideErrors is true", async () => {
    server.use(
      http.get("/doi/lookup/10.1000/xyz123", () => {
        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    renderWithQueryClient(
      <PublicationMeta doiValue={doiValue} enabled={true} hideErrors={true}>
        {(publication) => <div>{publication}</div>}
      </PublicationMeta>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });
  });
});
