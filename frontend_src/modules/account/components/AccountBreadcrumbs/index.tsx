import React from "react";
import { Link, useMatches } from "@tanstack/react-router";

const ROUTE_NAMES = {
  "/login/": "Login",
  "/signup/": "Signup",
  "/password/reset/": "Forgot password",
  "/password/reset/key/$key/": "Reset password",
  "/logout/": "Logout",
  "/change-password/": "Change password",
  "/profile/": "Profile",
};

const getRouteName = (currentRoute: string) => {
  for (const [route, name] of Object.entries(ROUTE_NAMES)) {
    const routePattern = route.replace(/\$[^/]+/g, "[^/]+"); // Replace $id with a wildcard pattern
    const regex = new RegExp(`^${routePattern}$`);
    if (regex.test(currentRoute)) {
      return name;
    }
  }
  return null;
};

export const AccountBreadcrumbs = () => {
  const match = useMatches();
  const currentRoute = match.slice(-1)[0]?.id;
  const currentRouteName = getRouteName(currentRoute);

  return (
    <nav className="flex mb-6 mx-6" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="/" className="text-gray-400 hover:text-secondary">
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>

        <li>
          <Link
            to="/account/"
            className="text-gray-500 hover:text-secondary flex items-center"
          >
            <svg
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="ml-4 text-sm font-medium">Account</span>
          </Link>
        </li>
        {currentRoute !== "/" && (
          <li>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-700">
                {currentRouteName}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};
