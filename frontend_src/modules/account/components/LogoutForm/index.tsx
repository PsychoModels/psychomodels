import React from "react";
import { Alert, Button } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../lib/allauth.ts";
import { Link } from "@tanstack/react-router";

export const LogoutForm = () => {
  const [isLoggedOut, setIsLoggedOut] = React.useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return logout();
    },
    onSuccess: () => {
      queryClient.clear();

      setIsLoggedOut(true);
    },
    onError: (error) => {
      // @ts-ignore
      if (error?.response?.data?.meta?.is_authenticated === false) {
        setIsLoggedOut(true);
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate();
  };

  if (isLoggedOut) {
    return (
      <>
        <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
          Logout
        </h1>
        <p className="text-gray-600 leading-6">
          You are successfully logged out.
        </p>
        <p>
          <Link to="/login/" className="text-tertiary hover:underline">
            Login again
          </Link>
        </p>
      </>
    );
  }

  const errors = mutation.isError
    ? // @ts-ignore
      mutation?.error?.response?.data?.errors || [
        {
          code: "general-error",
          message: "A general error occurred. Please try again.",
        },
      ]
    : [];

  return (
    <>
      <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Logout
      </h1>
      <p className="text-gray-600 leading-6">
        Are you sure you want to logout?
      </p>
      <form className="flex flex-col gap-8 mb-4" onSubmit={onSubmit}>
        {errors?.map((error: any) => (
          <Alert color="failure" key={error.code}>
            <span className="font-medium">Error!</span> {error.message}
          </Alert>
        ))}

        <Button
          type="submit"
          disabled={mutation.isPending}
          isProcessing={mutation.isPending}
        >
          Logout
        </Button>
      </form>
    </>
  );
};
