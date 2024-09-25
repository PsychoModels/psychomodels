import React, { useEffect } from "react";
import useStore from "../../store/useStore";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon";
import { MarkdownField } from "../../../shared/components/Form/MarkdownField";
import { SoftwarePackageField } from "../SoftwarePackageField";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { VariablesField } from "../VariablesField";
import { DOIInputField } from "../DOIInputField";
import { softwarePackageFormSchema } from "../SoftwarePackageField/SoftwarePackageFormModal";
import { ProgrammingLanguageSelectField } from "../ProgrammingLanguageSelectField";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  explanation: z.string(),
  programmingLanguageId: z.string().or(z.number()),
  softwarePackages: z.array(
    z.intersection(
      softwarePackageFormSchema,
      z.object({ id: z.string().or(z.number()) }),
    ),
  ),
  codeRepositoryUrl: z.union([
    z.literal(""),
    z.string().trim().url({
      message: "Invalid code repositoryURL",
    }),
  ]),
  dataUrl: z.union([
    z.literal(""),
    z.string().trim().url({
      message: "Invalid data URL",
    }),
  ]),

  publicationDOI: z.union([
    z.literal(""),
    z.string().regex(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i, {
      message: "Invalid publication DOI",
    }),
  ]),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const PublicationDetails = () => {
  const navigate = useNavigate({ from: "/publication-details" });
  const { setCompletedStatus } = useStore((state) => state);

  const { publicationDetails, setPublicationDetails } = useStore(
    (state) => state,
  );

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...publicationDetails },
  });
  const { control, handleSubmit, getValues, formState } = formMethods;

  const onSubmit = (values: ValidationSchema) => {
    setPublicationDetails({ ...publicationDetails, ...values });
    setCompletedStatus("publicationDetails", true);
    navigate({ to: "/review" });
  };

  useEffect(() => {
    return function saveFormState() {
      const values = getValues();
      setPublicationDetails({ ...publicationDetails, ...values });
    };
  }, [formState.isValid]);

  const onNavigateBack = () => {
    navigate({ to: "/model-summary" });
  };

  return (
    <FormProvider {...formMethods}>
      <div className="px-6 py-8">
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DOIInputField
            control={control}
            label="Publication DOI"
            name="publicationDOI"
          />
          <MarkdownField
            control={control}
            label="How does the model work"
            name="explanation"
          />

          <ProgrammingLanguageSelectField control={control} />

          <SoftwarePackageField control={control} />

          <TextInputField
            control={control}
            label="Code repository url"
            name="codeRepositoryUrl"
            placeholder="https://"
            tooltipText="The URL to the code repository where the model is hosted."
          />

          <TextInputField
            control={control}
            label="Data url"
            name="dataUrl"
            placeholder="https://"
          />

          <VariablesField control={control} />
        </form>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-between">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Review <ArrowIcon />
        </Button>
      </div>
    </FormProvider>
  );
};
