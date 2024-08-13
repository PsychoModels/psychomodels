import React from "react";
import { render, screen } from "@testing-library/react";
import { AccountBreadcrumbs } from "./index";
import { useMatches } from "@tanstack/react-router";
import { vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  useMatches: vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

describe("AccountBreadcrumbs", () => {
  it("should render Home and Account for the base account route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/account/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument(); // Profile shouldn't appear
  });

  it("should render the correct breadcrumb for the login route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/login/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("should render the correct breadcrumb for the signup route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/signup/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  });

  it("should render the correct breadcrumb for the logout route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/logout/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("should render the correct breadcrumb for the profile route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/profile/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  it("should render the correct breadcrumb for the password reset route", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/password/reset/key/abc123/" }]);

    render(<AccountBreadcrumbs />);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset password/i)).toBeInTheDocument();
  });

  it("should not render breadcrumb when current route is not found", () => {
    // @ts-ignore
    useMatches.mockReturnValue([{ id: "/unknown-route/" }]);

    render(<AccountBreadcrumbs />);

    // Assert that "Home" and "Account" links are rendered, but no specific route name
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.queryByText(/Reset password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Forgot password/i)).not.toBeInTheDocument();
  });
});
