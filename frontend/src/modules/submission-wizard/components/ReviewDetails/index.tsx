import React from "react";
import useStore from "../../store/useStore.ts";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";

const formSchema = z.object({
  remarks: z.string(),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const ReviewDetails = () => {
  const { reviewDetails, setReviewDetails, goToStep } = useStore(
    (state) => state,
  );

  const { control, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...reviewDetails },
  });

  const onSubmit = (values: ValidationSchema) => {
    setReviewDetails({ ...reviewDetails, ...values });

    // Todo
  };

  return (
    <>
      <div className="px-6 py-8">
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextAreaField control={control} label="Remarks" name="remarks" />
        </form>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={() => goToStep(4)}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Submit Psychology model
        </Button>
      </div>
    </>
  );
};
