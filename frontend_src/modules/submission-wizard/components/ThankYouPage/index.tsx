import React from "react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import { Button } from "flowbite-react";
import { useNavigate } from "@tanstack/react-router";

export const ThankYouPage = () => {
  const navigate = useNavigate({ from: "/thank-you" });

  const onSubmitHandler = () => {
    navigate({ to: "/" });
  };

  return (
    <>
      <div className="bg-white px-6 py-8 text-gray-600">
        <div>
          <p className="max-w-screen-md mb-4">
            Congratulations! Your model has been successfully submitted to{" "}
            <strong>Psycho</strong>
            <em>Models</em>. We appreciate your contribution to our growing
            repository of mathematical and computational models that describe
            psychological and behavioral measurement, mechanisms, and theories.
          </p>

          <p className="max-w-screen-md mb-4">
            What happens next?
            <br />
            Your model will now undergo a review and curation process by our
            team. Once the process is complete, the model will be made publicly
            available in the <strong>Psycho</strong>
            <em>Models</em> database. We might contact you for additional
            details or clarifications. You will receive an email when the model
            is published.
          </p>

          <p className="max-w-screen-md mb-4 font-bold">
            Thank you for contributing to <strong>Psycho</strong>
            <em>Models</em>!
          </p>
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-end">
        <Button type="submit" onClick={onSubmitHandler}>
          Submit another model <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
