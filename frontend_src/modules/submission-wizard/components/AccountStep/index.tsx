import React from "react";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import { useNavigate } from "@tanstack/react-router";
import useStore from "../../store/useStore.ts";

export const AccountStep = () => {
  const navigate = useNavigate({ from: "/account" });
  const { setCompletedStatus } = useStore((state) => state);

  const onNavigateNext = () => {
    setCompletedStatus("account", true);
    navigate({ to: "/model-information" });
  };

  const onNavigateBack = () => {
    navigate({ to: "/" });
  };

  return (
    <>
      <div className="bg-white px-6 py-8">
        <div>
          <p>account</p>
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>
        <Button type="submit" onClick={onNavigateNext}>
          Publication details <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
