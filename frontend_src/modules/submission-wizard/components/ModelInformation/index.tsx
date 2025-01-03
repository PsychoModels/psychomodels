import React, { useEffect } from "react";
import useStore from "../../store/useStore.ts";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { ModelingFrameworkField } from "../ModelingFrameworkField";
import { PsychologyDisciplineField } from "../PsychologyDisciplineField";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  title: z.string().max(255).min(1, { message: "Title is required" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required" }),
  frameworkIds: z
    .array(z.number().or(z.string()))
    .min(1, { message: "At least one framework is required" }),
  psychologyDisciplineIds: z.array(z.number().or(z.string())),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const ModelInformation = () => {
  const navigate = useNavigate({ from: "/model-summary" });
  const { setCompletedStatus } = useStore((state) => state);

  const { modelInformation, setModelInformation } = useStore((state) => state);

  const { control, handleSubmit, getValues, formState } =
    useForm<ValidationSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: { ...modelInformation },
    });

  const onSubmit = (values: ValidationSchema) => {
    setModelInformation({ ...modelInformation, ...values });
    setCompletedStatus("modelInformation", true);
    navigate({ to: "/publication-details" });
  };

  useEffect(() => {
    return function saveFormState() {
      const values = getValues();
      setModelInformation({ ...modelInformation, ...values });
    };
  }, [formState.isValid]);

  const onNavigateBack = () => {
    navigate({ to: "/account" });
  };

  return (
    <>
      <div className="px-6 py-8">
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField
            control={control}
            label="Title"
            name="title"
            required={true}
          />

          <TextAreaField
            control={control}
            label="Short description"
            name="shortDescription"
            required={true}
          />

          <ModelingFrameworkField control={control} />

          <PsychologyDisciplineField control={control} />
        </form>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-between">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Model Details <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
