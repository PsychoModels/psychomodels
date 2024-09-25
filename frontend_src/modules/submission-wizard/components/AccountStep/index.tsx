import React, { ReactNode } from "react";
import { Alert, Button, Spinner, Tooltip } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import { Outlet, useMatches, useNavigate } from "@tanstack/react-router";
import useStore from "../../store/useStore.ts";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../account/lib/allauth.ts";

const NextStepDisabledTooltipWrapper = ({
  children,
}: {
  children: ReactNode;
}) => (
  <Tooltip content="You must be logged in to go to the model summary step">
    {children}
  </Tooltip>
);

export const AccountStep = () => {
  const navigate = useNavigate({ from: "/account" });
  const { setCompletedStatus } = useStore((state) => state);

  const match = useMatches();
  const currentRoute = match.slice(-1)[0]?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "session", "status"],
    queryFn: async () => {
      try {
        const data = await getSession();

        data.loggedIn = true;
        return data;
      } catch (error) {
        // @ts-ignore
        if (error?.response?.status === 401) {
          return { loggedIn: false };
        }
        throw error;
      }
    },
  });

  const onNavigateNext = () => {
    setCompletedStatus("account", true);
    navigate({ to: "/model-summary" });
  };

  const onNavigateBack = () => {
    navigate({ to: "/" });
  };

  const nextStepDisabled = !data || !data.loggedIn;

  let NextStepWrapperComponent;

  if (nextStepDisabled) {
    NextStepWrapperComponent = NextStepDisabledTooltipWrapper;
  } else {
    // You can define another component or use a fragment if no wrapper is needed
    // eslint-disable-next-line react/display-name
    NextStepWrapperComponent = ({ children }: { children: ReactNode }) => (
      <>{children}</>
    );
  }

  const showOutlet =
    (data && data.loggedIn === false) || currentRoute === "/account/profile/";

  const showLoggedIn = data && !showOutlet;

  return (
    <>
      <div className="bg-white px-6 py-8">
        <div className="space-y-6 max-w-screen-sm mb-8 mx-auto">
          <p className="text-gray-500 leading-7 pb-2">
            In order to submit a model you must have an account and be logged
            in.
          </p>

          {isLoading && <Spinner data-testid="loading-indicator" />}

          {isError && (
            <Alert color="warning" data-testid="error-message">
              An error occurred. Please try again.
            </Alert>
          )}

          {showOutlet && <Outlet />}
          {showLoggedIn && (
            <p
              className="text-gray-600 leading-6 font-bold"
              data-testid="logged-in-status"
            >
              You are logged in with e-mail{" "}
              <em className="text-gray-500">{data.data?.user?.email}</em>.
            </p>
          )}
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-between">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>
        <NextStepWrapperComponent>
          <Button
            type="submit"
            onClick={onNavigateNext}
            disabled={nextStepDisabled}
          >
            Model summary
            <ArrowIcon />
          </Button>
        </NextStepWrapperComponent>
      </div>
    </>
  );
};
