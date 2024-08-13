import React from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "@tanstack/react-router";
import { AccountBreadcrumbs } from "../AccountBreadcrumbs";
import { LogoutForm } from "../LogoutForm";
import { LoginStatus } from "../LoginStatus";
import { ChangePasswordForm } from "../ChangePasswordForm";
import { LoginPage } from "../LoginPage";
import { SignupPage } from "../SignupPage";
import { ForgotPasswordPage } from "../ForgotPasswordPage";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { ProfilePage } from "../ProfilePage";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <AccountBreadcrumbs />
        <div className="flex flex-col items-center   mx-auto lg:py-0  md:px-4 lg:px-6 mt-6 w-full">
          <div className="w-full bg-white sm:rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 min-w-96  ">
              <ScrollRestoration />
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
  },
});

const accountHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Login() {
    return <LoginStatus />;
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login/",
  component: function Login() {
    return <LoginPage />;
  },
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup/",
  component: function Signup() {
    return <SignupPage />;
  },
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/",
  component: function Signup() {
    return <ProfilePage />;
  },
});

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/change-password/",
  component: function Signup() {
    return <ChangePasswordForm />;
  },
});

const logoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/logout/",
  component: function Signup() {
    return <LogoutForm />;
  },
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/password/reset/",
  component: function Signup() {
    return <ForgotPasswordPage />;
  },
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/password/reset/key/$key/",
  component: function Signup() {
    return <ResetPasswordForm />;
  },
});

const routeTree = rootRoute.addChildren([
  accountHomeRoute,
  loginRoute,
  signupRoute,
  logoutRoute,
  changePasswordRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

export const AccountRouter = () => {
  return <RouterProvider router={router} basepath="/account/" />;
};
