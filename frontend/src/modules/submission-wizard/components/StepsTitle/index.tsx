import React from "react";
import useStore from "../../store/useStore.ts";

const STEP_TITLES: { [key: number]: string } = {
  1: "Submission guidelines",
  2: "Account",
  3: "Model information",
  4: "Publication details",
  5: "Review",
};

export const StepsTitle = () => {
  const currentStep = useStore((state) => state.currentStep);
  return (
    <div className="flex items-baseline px-6 pt-4 bg-white ">
      <h2 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        {STEP_TITLES[currentStep]}
      </h2>
      <div className="ml-auto text-sm text-gray-600">
        <span className="font-semibold">{currentStep}</span> of{" "}
        <span className="font-semibold">5</span> complete
      </div>
    </div>
  );
};
