import React from "react";
import { LoginForm } from "../LoginForm";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSessionStatusRedirect } from "../../hooks/useSessionStatusRedirect";

export const LoginPage = () => {
  const navigate = useNavigate({ from: "/login" });

  useSessionStatusRedirect();
  const onLoginSuccess = (result: any) => {
    if (result?.data?.user?.first_name && result?.data?.user?.last_name) {
      navigate({
        to: "/",
      });
    } else {
      navigate({
        to: "/profile/",
      });
    }
  };

  return (
    <>
      <h1 className="text-cyan-700 text-xl font-bold md:text-2xl">
        Login to your account
      </h1>
      <p className="text-gray-500 leading-7">
        Login to Psycho<em>Models</em> to submit new models or request a change
        for an existing model.
        <br /> Don’t have an account?{" "}
        <Link
          to="/signup"
          className="inline-flex items-center text-tertiary hover:underline"
        >
          Sign up
        </Link>
      </p>
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        forgotPasswordLink={<Link to="/password/reset/">Forgot password?</Link>}
      />
    </>
  );
};
