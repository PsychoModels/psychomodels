import React from "react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import useStore from "../../store/useStore.ts";
import { Button } from "flowbite-react";
import { useNavigate } from "@tanstack/react-router";

export const SubmissionGuidelines = () => {
  const navigate = useNavigate({ from: "/" });

  const { setCompletedStatus } = useStore((state) => state);

  const onSubmitHandler = () => {
    setCompletedStatus("submissionGuidelines", true);
    navigate({ to: "/account" });
  };

  return (
    <>
      <div className="bg-white px-6 py-8">
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t">
        <Button type="submit" onClick={onSubmitHandler}>
          Agree and continue <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
