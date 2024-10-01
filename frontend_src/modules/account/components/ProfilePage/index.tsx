import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../lib/allauth.ts";
import { Alert, Spinner } from "flowbite-react";
import { ProfileForm } from "../ProfileForm";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Your profile
      </h1>
      {children}
    </>
  );
};

export const ProfilePage = () => {
  const [isDone, setIsDone] = React.useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
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

  const user = data?.data?.user;

  const initialData = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    university: user?.university || "",
    department: user?.department || "",
    position: user?.position || "",
    country: user?.country || "",
  };

  const onSaveSuccess = () => {
    setIsDone(true);
  };

  if (isDone) {
    return (
      <Wrapper>
        <p className="text-gray-600 leading-6">
          Your profile has been successfully updated.
        </p>
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

  return (
    <Wrapper>
      <p className="text-gray-500 leading-7">
        {data?.user?.first_name && data?.user?.last_name
          ? "Update your profile."
          : "Please complete your profile before continuing."}
      </p>

      <ProfileForm onSaveSuccess={onSaveSuccess} initialValues={initialData} />
    </Wrapper>
  );
};
