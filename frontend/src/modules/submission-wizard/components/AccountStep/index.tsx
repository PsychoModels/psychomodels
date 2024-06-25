import React from "react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import useStore from "../../store/useStore.ts";

export const AccountStep = () => {
  const { increaseStep } = useStore((state) => state);

  const onSubmitHandler = () => {
    increaseStep(2);
  };
  return (
    <>
      <div className="bg-white px-6 py-8">
        <div>
          <p>account</p>
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t">
        {/*<EuiButton*/}
        {/*  onClick={onSubmitHandler}*/}
        {/*  fill*/}
        {/*  iconSide="right"*/}
        {/*  iconType={ArrowIcon}*/}
        {/*  iconSize={"l" as "m"}*/}
        {/*>*/}
        {/*  Login*/}
        {/*</EuiButton>*/}
      </div>
    </>
  );
};
