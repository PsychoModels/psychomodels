import React from "react";
import { DraftModel, SubmittedModel } from "../DataProvider";
import { MyDraftModelTable } from "./MyDraftModelTable.tsx";

interface Props {
  draftModels: DraftModel[];
  submittedModels: SubmittedModel[];
}

export const MyModelList = ({ draftModels }: Props) => {
  return (
    <div className="px-6 pt-4 mb-12">
      <h2 className="text-cyan-700 text-xl font-bold md:text-2xl pl-4 mb-4">
        My draft submissions
      </h2>

      <MyDraftModelTable draftModels={draftModels} />

      {/*<h2 className="text-cyan-700 text-xl font-bold md:text-2xl pl-4 mb-4 mt-12">*/}
      {/*  My submitted models*/}
      {/*</h2>*/}

      {/*<MySubmissionModelTable submittedModels={submittedModels} />*/}
    </div>
  );
};
