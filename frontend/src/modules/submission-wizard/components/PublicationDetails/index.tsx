import React from "react";
import useStore from "../../store/useStore";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon";
import { MarkdownField } from "../../../shared/components/Form/MarkdownField";
import { SelectField } from "../../../shared/components/Form/SelectField";
import { SoftwarePackageField } from "../SoftwarePackageField";
import { softwarePackageFormSchema } from "../SoftwarePackageField/SoftwarePackageFormModal";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { VariablesField } from "../VariablesField";
import { variableFormSchema } from "../VariablesField/VariableFormModal.tsx";
import { DOIInputField } from "../DOIInputField";

const formSchema = z.object({
  explanation: z.string().min(1),
  programmingLanguageId: z.string().min(1).or(z.number().min(1)),
  softwarePackages: z.array(
    z.intersection(
      softwarePackageFormSchema,
      z.object({ id: z.string().or(z.number()) }),
    ),
  ),
  codeRepositoryUrl: z.union([z.literal(""), z.string().trim().url()]),
  dataUrl: z.union([z.literal(""), z.string().trim().url()]),
  variables: z.array(
    z.intersection(
      variableFormSchema,
      z.object({ id: z.string().or(z.number()) }),
    ),
  ),
  publicationDIO: z.union([
    z.literal(""),
    z.string().regex(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i),
  ]),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const PublicationDetails = () => {
  const { publicationDetails, setPublicationDetails, goToStep } = useStore(
    (state) => state,
  );

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...publicationDetails },
  });

  const { control, handleSubmit } = formMethods;

  const onSubmit = (values: ValidationSchema) => {
    setPublicationDetails({ ...publicationDetails, ...values });
    goToStep(5);
  };

  const { programmingLanguages } = useStore((state) => state);

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
            name="publicationDIO"
          />
          <MarkdownField
            control={control}
            label="How does the model works"
            name="explanation"
          />

          <SelectField
            control={control}
            label="Programming language"
            name="programmingLanguageId"
            placeholder="Select a programming language or add one"
            options={programmingLanguages.map((language) => ({
              label: language.name,
              value: language.id,
            }))}
          />

          <SoftwarePackageField control={control} />

          <TextInputField
            control={control}
            label="Code repository url"
            name="codeRepositoryUrl"
            placeholder="https://"
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
      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={() => goToStep(3)}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Review <ArrowIcon />
        </Button>
      </div>
    </FormProvider>
  );
};
