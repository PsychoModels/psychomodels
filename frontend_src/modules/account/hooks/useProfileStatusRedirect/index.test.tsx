import { renderHook } from "@testing-library/react-hooks";
import { useNavigate } from "@tanstack/react-router";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";
import { useProfileStatusRedirect } from "./index.ts";
import { queryClientWrapper } from "../../../../test-utils/testQueryProvider.tsx";
import { waitFor } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("useProfileStatusRedirect", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
  });

  it("should not navigate if there is no data", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return new HttpResponse(null, {
          status: 200,
        });
      }),
    );

    const { result } = renderHook(() => useProfileStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should not navigate if user is not logged in", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return new HttpResponse(null, {
          status: 401,
        });
      }),
    );
    const { result } = renderHook(() => useProfileStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to /profile/ if the user is logged in but has missing first_name or last_name", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return HttpResponse.json({
          data: {
            user: {
              id: 1,
              username: "user",
              email: "user@psychomodels.org",
              first_name: null,
              last_name: null,
              country: null,
              university: null,
              department: null,
            },
          },
        });
      }),
    );

    const { result } = renderHook(() => useProfileStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).toHaveBeenCalled();
  });

  it("should not navigate if the user is logged in and has both first_name and last_name", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return HttpResponse.json({
          data: {
            user: {
              id: 1,
              username: "user",
              email: "user@psychomodels.org",
              first_name: "John",
              last_name: "Doe",
              country: "NL",
              university: "University of Amsterdam",
              department: "Psychology",
            },
          },
        });
      }),
    );

    const { result } = renderHook(() => useProfileStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
