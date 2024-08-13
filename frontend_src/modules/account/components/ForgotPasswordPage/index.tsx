import React from "react";
import { Link } from "@tanstack/react-router";

import { ForgotPasswordForm } from "../ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <>
      <h1 className="text-cyan-700 text-xl font-bold md:text-2xl">
        Forgot you password?
      </h1>
      <p className="text-gray-500 leading-7 -mt-6">
        Enter your email address and we will send you a link to reset your
        password if the account exists.
      </p>
      <p>
        <Link to="/account/login" className="text-tertiary hover:underline">
          Back to login.
        </Link>
      </p>
      <ForgotPasswordForm />
    </>
  );
};
