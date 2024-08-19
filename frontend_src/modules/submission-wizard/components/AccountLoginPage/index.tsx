import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "../../../account/components/LoginForm";
import useStore from "../../store/useStore.ts";

export const AccountLoginPage = () => {
  const navigate = useNavigate({ from: "/account" });
  const { setCompletedStatus } = useStore((state) => state);

  const onLoginSuccess = (data: any) => {
    if (data?.data?.user?.first_name && data?.data?.user?.last_name) {
      setCompletedStatus("account", true);
      navigate({
        to: "/model-information",
      });
    } else {
      navigate({
        to: "/account/profile/",
      });
    }
  };

  return (
    <>
      <div>
        <p className="text-gray-500 leading-7 -mt-6">
          Don’t have an account?{" "}
          <Link
            to="signup"
            className="inline-flex items-center text-tertiary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        socialAccountsNewWindow={true}
        forgotPasswordLink={
          <Link to="/account/password/reset/">Forgot password?</Link>
        }
      />
    </>
  );
};
