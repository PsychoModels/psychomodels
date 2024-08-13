import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../lib/allauth.ts";
import { Alert, Spinner } from "flowbite-react";
import { Link } from "@tanstack/react-router";
import { useProfileStatusRedirect } from "../../hooks/useProfileStatusRedirect";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Your account
      </h1>
      {children}
    </>
  );
};

export const LoginStatus = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      try {
        return await getSession();
      } catch (error) {
        // @ts-ignore
        if (error?.response?.status === 401) {
          return { loggedIn: false };
        }
        throw error;
      }
    },
  });

  useProfileStatusRedirect();

  const showChangePasswordLink = data?.data?.user?.has_usable_password;

  if (data) {
    if (data.loggedIn === false) {
      return (
        <Wrapper>
          <p className="text-gray-600 leading-6">You are not logged in.</p>
          <ul className="space-y-2">
            <li>
              <Link to="/login/" className="text-tertiary hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup/" className="text-tertiary hover:underline">
                Sign up
              </Link>
            </li>
          </ul>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <p className="text-gray-600 leading-6">
          You are logged in with e-mail{" "}
          <em className="text-gray-500">{data.data?.user?.email}</em>.
        </p>
        <ul className="space-y-2">
          {showChangePasswordLink && (
            <li>
              <Link
                to="/change-password/"
                className="text-tertiary hover:underline"
              >
                Change your password
              </Link>
            </li>
          )}
          <li>
            <Link to="/logout" className="text-tertiary hover:underline">
              Logout
            </Link>
          </li>
        </ul>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Spinner />
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <Alert color="warning">An error occurred. Please try again.</Alert>
      </Wrapper>
    );
  }
};
