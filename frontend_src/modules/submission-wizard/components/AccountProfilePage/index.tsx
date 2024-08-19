import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../account/lib/allauth.ts";
import { Alert, Spinner } from "flowbite-react";
import { ProfileForm } from "../../../account/components/ProfileForm";
import useStore from "../../store/useStore.ts";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <p className="text-gray-500 leading-7">
        Please complete your profile before continuing.
      </p>
      {children}
    </>
  );
};

export const AccountProfilePage = () => {
  const navigate = useNavigate({ from: "/account/profile" });

  const { setCompletedStatus } = useStore((state) => state);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "session", "profile"],
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
    gcTime: 0,
  });

  const user = data?.data?.user;

  const initialData = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    university: user?.university || "",
    department: user?.department || "",
    country: user?.country || "",
  };

  const onSaveSuccess = () => {
    setCompletedStatus("account", true);
    navigate({
      to: "/model-information",
    });
  };

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
      <ProfileForm onSaveSuccess={onSaveSuccess} initialValues={initialData} />
    </Wrapper>
  );
};
