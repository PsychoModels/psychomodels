import React from "react";
import { Step } from "./Step.tsx";
import useStore from "../../store/useStore.ts";
import { useMatches } from "@tanstack/react-router";

export const StepsHeader = () => {
  const { completedStatus } = useStore((state) => state);

  const match = useMatches();
  const currentRoute = match.slice(-1)[0]?.id;

  const allowNavigate = currentRoute !== "/thank-you/";
  const allCompleted = currentRoute === "/thank-you/";

  return (
    <nav aria-label="Progress" className="pt-1">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-lg border border-gray-300 md:flex md:divide-y-0 m-5"
      >
        <Step
          stepNumber={1}
          title="Submission guidelines"
          addSeparator
          route="/"
          isCompleted={completedStatus.submissionGuidelines || allCompleted}
          allowNavigate={allowNavigate}
        />
        <Step
          stepNumber={2}
          title="Account"
          addSeparator
          route="/account"
          isCompleted={completedStatus.account || allCompleted}
          allowNavigate={allowNavigate}
        />

        <Step
          stepNumber={3}
          title="Model information"
          addSeparator
          route="/model-information"
          isCompleted={completedStatus.modelInformation || allCompleted}
          allowNavigate={allowNavigate}
        />
        <Step
          stepNumber={4}
          title="Publication details"
          addSeparator
          route="/publication-details"
          isCompleted={completedStatus.publicationDetails || allCompleted}
          allowNavigate={allowNavigate}
        />
        <Step
          stepNumber={5}
          title="Review"
          route="/review"
          isCompleted={completedStatus.review || allCompleted}
          allowNavigate={allowNavigate}
        />
      </ol>
    </nav>
  );
};
