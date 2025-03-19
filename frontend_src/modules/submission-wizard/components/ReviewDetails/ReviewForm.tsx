import React from "react";
import { PsychologyModelDetail } from "../PsychologyModelDetail";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { ValidationSchema } from "./index.tsx";
import { CheckboxField } from "../../../shared/components/Form/CheckboxField.tsx";

interface Props {
  control: Control<ValidationSchema, any>;
  onSubmit: (values: ValidationSchema) => void;
  handleSubmit: UseFormHandleSubmit<ValidationSchema>;
}

export const ReviewForm = ({ control, handleSubmit, onSubmit }: Props) => {
  return (
    <form
      className="flex flex-col gap-4 mb-4"
      data-testid="review-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PsychologyModelDetail />

      <h2 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Remarks
      </h2>

      <TextAreaField
        control={control}
        label="Do you have any remarks, feedback or extra details you want to share about this submission?"
        name="remarks"
      />

      <h2 className="text-cyan-700 text-lg text-md font-bold md:text-2xl mt-8">
        Terms of Agreement
      </h2>

      <p className="max-w-screen-md mb-4 text-gray-600">
        All details provided about the models in <strong>Psycho</strong>
        <em>Models</em> are available under the terms of the Creative Commons
        CC0 1.0 (Public Domain Dedication). Therefore you need to agree to
        release the information you will provide in the Public Domain before
        submitting them to <strong>Psycho</strong>
        <em>Models</em>. Please note that this does not extend to publications,
        code repositories, and data repositories linked to the{" "}
        <strong>Psycho</strong>
        <em>Models</em> database.
      </p>

      <CheckboxField
        control={control}
        label="Yes, I agree to release the provided model information in the Public Domain."
        name="termsOfAgreement"
      />
    </form>
  );
};
