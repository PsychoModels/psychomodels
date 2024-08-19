import React from "react";
import { PsychologyModelDetail } from "../PsychologyModelDetail";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { ValidationSchema } from "./index.tsx";

interface Props {
  control: Control<ValidationSchema, any>;
  onSubmit: (values: ValidationSchema) => void;
  handleSubmit: UseFormHandleSubmit<ValidationSchema>;
}

export const ReviewForm = ({ control, handleSubmit, onSubmit }: Props) => {
  return (
    <form
      className="flex flex-col gap-8 mb-4"
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
    </form>
  );
};
