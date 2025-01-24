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

import { AccountSignupPage } from "../AccountSignupPage";
import { AccountLoginPage } from "../AccountLoginPage";
import { AccountForgotPasswordPage } from "../AccountForgotPasswordPage";
import { ThankYouPage } from "../ThankYouPage";
import { AccountProfilePage } from "../AccountProfilePage";
import { saveDraft } from "../../util/saveDraft.ts";

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
  component: function IndexPage() {
    return <SubmissionGuidelines />;
  },
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: function AccountPage() {
    return <AccountStep />;
  },
});

const modelInformationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/model-summary/",
  component: function ModelInformationPage() {
    return <ModelInformation />;
  },
  onLeave: () => {
    saveDraft();
  },
});

const publicationDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publication-details/",
  component: function PublicationDetailsPage() {
    return <PublicationDetails />;
  },
  onLeave: () => {
    saveDraft();
  },
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/review/",
  component: function ReviewPage() {
    return <ReviewDetails />;
  },
  onLeave: () => {
    saveDraft();
  },
});

const completedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thank-you/",
  component: function CompletedPage() {
    return <ThankYouPage />;
  },
});

export const accountLoginRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "/",
  component: function Login() {
    return <AccountLoginPage />;
  },
});

export const accountSignupRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "/signup/",
  component: function Signup() {
    return <AccountSignupPage />;
  },
});

export const accountProfileRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "/profile/",
  component: function Profile() {
    return <AccountProfilePage />;
  },
});

export const accountForgotPasswordRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "/password/reset/",
  component: function Signup() {
    return <AccountForgotPasswordPage />;
  },
});

const routeTree = rootRoute.addChildren([
  submissionGuidelinesRoute,
  accountRoute.addChildren([
    accountLoginRoute,
    accountSignupRoute,
    accountForgotPasswordRoute,
    accountProfileRoute,
  ]),
  modelInformationRoute,
  publicationDetailsRoute,
  reviewRoute,
  completedRoute,
]);

const router = createRouter({ routeTree });

export const SubmissionWizardRouter = () => {
  return <RouterProvider router={router} basepath="/models/submission/" />;
};
