import React from "react";
import { StepsHeader } from "../StepsHeader";
import { SubmissionGuidelines } from "../SubmissionGuidelines";
import { AccountStep } from "../AccountStep";
import { ModelInformation } from "../ModelInformation/";
import { PublicationDetails } from "../PublicationDetails";
import { StepsTitle } from "../StepsTitle";
import { ReviewDetails } from "../ReviewDetails";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <ScrollRestoration />
        <StepsHeader />
        <StepsTitle />
        <Outlet />
      </>
    );
  },
});

const submissionGuidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <SubmissionGuidelines />;
  },
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: function Index() {
    return <AccountStep />;
  },
});

const modelInformationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/model-information",
  component: function Index() {
    return <ModelInformation />;
  },
});

const publicationDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publication-details",
  component: function Index() {
    return <PublicationDetails />;
  },
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/review",
  component: function Index() {
    return <ReviewDetails />;
  },
});

const completedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submitted",
  component: function Index() {
    return <div>done</div>;
  },
});

const routeTree = rootRoute.addChildren([
  submissionGuidelinesRoute,
  accountRoute,
  modelInformationRoute,
  publicationDetailsRoute,
  reviewRoute,
  completedRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const SubmissionWizardRouter = () => {
  return <RouterProvider router={router} basepath="/models/submission/" />;
};
