import React from "react";

import useStore from "../../store/useStore.ts";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { ModelingFrameworkField } from "../ModelingFrameworkField";

const formSchema = z.object({
  title: z.string().max(255).min(1),
  shortDescription: z.string().min(1),
  frameworkIds: z.array(z.number().or(z.string())).min(1),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const ModelInformation = () => {
  const { modelInformation, setModelInformation, goToStep } = useStore(
    (state) => state,
  );

  const { control, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...modelInformation },
  });

  const onSubmit = (values: ValidationSchema) => {
    setModelInformation({ ...modelInformation, ...values });
    goToStep(4);
  };

  return (
    <>
      <div className="px-6 py-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <TextInputField control={control} label="Title" name="title" />
          </div>

          <div className="mb-8">
            <TextAreaField
              control={control}
              label="Short description"
              name="shortDescription"
            />
          </div>

          <div className="mb-8">
            <ModelingFrameworkField control={control} />
          </div>
        </form>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={() => goToStep(2)}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Publication details <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
