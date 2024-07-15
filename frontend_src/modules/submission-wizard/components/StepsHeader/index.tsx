import React from "react";
import { Step } from "./Step.tsx";

export const StepsHeader = () => (
  <nav aria-label="Progress">
    <ol
      role="list"
      className="divide-y divide-gray-300 rounded-lg border border-gray-300 md:flex md:divide-y-0 m-5 overflow-scroll"
    >
      <Step stepNumber={1} title="Submission guidelines" addSeperator />
      <Step stepNumber={2} title="Account" addSeperator />

      <Step stepNumber={3} title="Model information" addSeperator />
      <Step stepNumber={4} title="Publication details" addSeperator />
      <Step stepNumber={5} title="Review" />
    </ol>
  </nav>
);
