import React from "react";
import { useMatches } from "@tanstack/react-router";

const STEP_TITLES = {
  "/": "Submission guidelines",
  "/account/": "Login to your account",
  "/account/signup/": "Signup for an account",
  "/account/password/reset/": "Forgot password?",
  "/account/profile/": "Complete profile",
  "/model-information/": "Model information",
  "/publication-details/": "Publication details",
  "/review/": "Review",
  "/thank-you/": "Submission complete",
};

const ROUTES_STEP_NUMBER = {
  "/": 1,
  "/account/": 2,
  "/account/signup/": 2,
  "/account/password/reset/": 2,
  "/account/profile/": 2,
  "/model-information/": 3,
  "/publication-details/": 4,
  "/review/": 5,
  "/thank-you/": 5,
};

export const StepsTitle = () => {
  const match = useMatches();
  const currentRoute = match.slice(-1)[0]?.id;

  return (
    <div className="flex items-baseline px-6 pt-4 bg-white ">
      <h2 className="text-cyan-700 text-xl font-bold md:text-2xl">
        {STEP_TITLES[currentRoute as keyof typeof STEP_TITLES]}
      </h2>
      {currentRoute !== "/thank-you/" && (
        <div
          className="ml-auto text-sm text-gray-600"
          data-testid="step-progress-indicator"
        >
          <span className="font-semibold">
            {ROUTES_STEP_NUMBER[currentRoute as keyof typeof STEP_TITLES]}
          </span>{" "}
          of <span className="font-semibold">5</span> complete
        </div>
      )}
    </div>
  );
};
