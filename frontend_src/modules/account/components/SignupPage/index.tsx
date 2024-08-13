import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SignupForm } from "../SignupForm";

export const SignupPage = () => {
  const navigate = useNavigate({ from: "/signup" });

  const onSignupSuccess = () => {
    navigate({
      to: "/profile",
    });
  };

  return (
    <>
      <h1 className="text-cyan-700 text-xl font-bold md:text-2xl">
        Sign up for an account
      </h1>
      <p className="text-gray-500 leading-7">
        Sign up to Psycho<em>Models</em> to submit new models or request a
        change for an existing model.
        <br />
        Already have an account?{" "}
        <Link
          to="/login/"
          className="inline-flex items-center text-tertiary hover:underline"
        >
          Login
        </Link>
      </p>

      <SignupForm onSignupSuccess={onSignupSuccess} />
    </>
  );
};
