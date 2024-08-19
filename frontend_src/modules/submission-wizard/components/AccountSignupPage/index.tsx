import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SignupForm } from "../../../account/components/SignupForm";

export const AccountSignupPage = () => {
  const navigate = useNavigate({ from: "/account/signup" });

  const onSignupSuccess = () => {
    navigate({
      to: "/account/profile/",
    });
  };
  return (
    <>
      <div>
        <p className="text-gray-500 leading-7 -mt-6">
          Already have an account?{" "}
          <Link
            to="/account/"
            className="inline-flex items-center text-tertiary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
      <SignupForm
        onSignupSuccess={onSignupSuccess}
        socialAccountsNewWindow={true}
      />
    </>
  );
};
