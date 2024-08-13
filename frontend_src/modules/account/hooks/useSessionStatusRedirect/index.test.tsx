import { renderHook } from "@testing-library/react-hooks";
import { useNavigate } from "@tanstack/react-router";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { server } from "../../../../setup-vitest.ts";
import { http, HttpResponse } from "msw";

import { queryClientWrapper } from "../../../../test-utils/testQueryProvider.tsx";
import { waitFor } from "@testing-library/react";
import { useSessionStatusRedirect } from "./index.ts";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("useSessionStatusRedirect", () => {
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

    const { result } = renderHook(() => useSessionStatusRedirect(), {
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
    const { result } = renderHook(() => useSessionStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to / if the user is logged", async () => {
    server.use(
      http.get("/_allauth/browser/v1/auth/session", () => {
        return HttpResponse.json({
          data: {
            user: {
              id: 1,
              username: "user",
            },
          },
        });
      }),
    );

    const { result } = renderHook(() => useSessionStatusRedirect(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockNavigate).toHaveBeenCalled();
  });
});
