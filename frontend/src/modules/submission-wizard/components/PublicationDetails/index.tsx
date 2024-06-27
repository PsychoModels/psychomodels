import React from "react";
import useStore from "../../store/useStore";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon";
import { MarkdownField } from "../../../shared/components/Form/MarkdownField";
import { SelectField } from "../../../shared/components/Form/SelectField";
import { SoftwarePackageField } from "../SoftwarePackageField";
import { softwarePackageFormSchema } from "../SoftwarePackageField/SoftwarePackageFormModal";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { VariablesField } from "../VariablesField";

const formSchema = z.object({
  explanation: z.string().min(1),
  programmingLanguage: z.string().min(1).or(z.number().min(1)),
  softwarePackages: z.array(
    z.intersection(softwarePackageFormSchema, z.object({ id: z.string() })),
  ),
  codeRepositoryUrl: z.union([z.literal(""), z.string().trim().url()]),
  dataUrl: z.union([z.literal(""), z.string().trim().url()]),
  variables: z.array(
    z.intersection(softwarePackageFormSchema, z.object({ id: z.string() })),
  ),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const PublicationDetails = () => {
  const { publicationDetails, setPublicationDetails, goToStep } = useStore(
    (state) => state,
  );

  const { control, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...publicationDetails },
  });

  const onSubmit = (values: ValidationSchema) => {
    setPublicationDetails({ ...publicationDetails, ...values });
    goToStep(4);
  };

  const { programmingLanguages } = useStore((state) => state);

  return (
    <>
      <div className="px-6 py-8">
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <MarkdownField
            control={control}
            label="How does the model works"
            name="explanation"
          />

          <SelectField
            control={control}
            label="Programming language"
            name="programmingLanguage"
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
        <code>{JSON.stringify(publicationDetails, null, 2)}</code>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={() => goToStep(3)}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Review <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
