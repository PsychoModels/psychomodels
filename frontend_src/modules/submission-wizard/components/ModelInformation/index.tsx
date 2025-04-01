import React, { useCallback, useEffect, useRef } from "react";
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
import { SaveAsDraftButton } from "../SaveAsDraftButton";

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

  const isValidRef = useRef(formState.isValid);
  const isDirtyRef = useRef(false);

  useEffect(() => {
    isValidRef.current = formState.isValid;
  }, [formState.isValid]);

  useEffect(() => {
    isDirtyRef.current = formState.isDirty;
  }, [formState.isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const onSubmit = (values: ValidationSchema) => {
    setModelInformation({ ...modelInformation, ...values });
    setCompletedStatus("modelInformation", true);
    isDirtyRef.current = false;
    navigate({ to: "/publication-details" });
  };

  useEffect(() => {
    return () => {
      const values = getValues();
      setModelInformation({ ...modelInformation, ...values });
      setCompletedStatus("modelInformation", isValidRef.current);
    };
  }, []);

  const beforeSaveDraft = useCallback(() => {
    const values = getValues();
    setModelInformation({ ...modelInformation, ...values });
  }, []);

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
            tooltipText="Choose a short but descriptive name for your model. Please keep it under ten words. For inspiration, visit Explore the models."
          />

          <TextAreaField
            control={control}
            label="Short description"
            name="shortDescription"
            required={true}
            tooltipText="Provide a summary of what the model is, does, and/or is used for, comparable to an abstract of a journal publication. The technical details about how the model works can be left out (they can be provided in the next step)."
          />

          <ModelingFrameworkField
            control={control}
            tooltipText="Select the framework or model family to which the model belongs. You can introduce a new framework if the proper framework is not yet part of the list."
          />

          <PsychologyDisciplineField
            control={control}
            tooltipText="Select the discipline(s) to which the model applies or for which it was developed."
          />
        </form>
      </div>
      <div className="md:hidden flex justify-end">
        <SaveAsDraftButton
          asLink
          beforeSaveDraft={beforeSaveDraft}
          onSaved={() => {
            isDirtyRef.current = false;
          }}
        />
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-between">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>

        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Model Details <ArrowIcon />
        </Button>

        <div className="!ml-auto hidden md:block">
          <SaveAsDraftButton
            beforeSaveDraft={beforeSaveDraft}
            onSaved={() => {
              isDirtyRef.current = false;
            }}
          />
        </div>
      </div>
    </>
  );
};
