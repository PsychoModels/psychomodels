import React from "react";
import { Link } from "@tanstack/react-router";
import { ForgotPasswordForm } from "../../../account/components/ForgotPasswordForm";

export const AccountForgotPasswordPage = () => {
  return (
    <>
      <div>
        <p className="text-gray-500 leading-7 -mt-6">
          Enter your email address and we will send you a link to reset your
          password if the account exists.{" "}
        </p>
        <p className="mt-2">
          <Link to="/account" className="text-tertiary hover:underline">
            Back to login.
          </Link>
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
};
