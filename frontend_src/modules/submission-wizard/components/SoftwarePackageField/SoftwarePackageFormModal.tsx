import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useStore from "../../store/useStore.ts";
import { SoftwarePackage } from "../../../../models";
import { SelectField } from "../../../shared/components/Form/SelectField.tsx";

interface Props {
  show: boolean;
  onClose: () => void;
  existingValue: SoftwarePackage | null;
  onChange: (value: SoftwarePackage) => void;
}

export const softwarePackageFormSchema = z.object({
  name: z.string().max(255).min(1),
  description: z.string(),
  documentationUrl: z.union([z.literal(""), z.string().trim().url()]),
  codeRepositoryUrl: z.union([z.literal(""), z.string().trim().url()]),
  programmingLanguageId: z.string().min(1).or(z.number().min(1)),
});

type ValidationSchema = z.infer<typeof softwarePackageFormSchema>;

export const SoftwarePackageFormModal = ({
  show,
  onClose,
  existingValue,
  onChange,
}: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(softwarePackageFormSchema),
    defaultValues: existingValue || {
      name: "",
      description: "",
      documentationUrl: "",
      codeRepositoryUrl: "",
    },
  });

  const { programmingLanguages } = useStore((state) => state);

  const onSubmit = (values: ValidationSchema) => {
    if (existingValue) {
      onChange({
        ...values,
        id: existingValue.id,
      });
    } else {
      const id = `NEW--${Math.random().toString()}`;
      onChange({
        ...values,
        id,
      });
    }

    reset();
    onClose();
  };

  return (
    <Modal show={show} size="6xl" onClose={onClose}>
      <Modal.Header>
        {existingValue ? "Edit software package" : "Add software package"}
      </Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField control={control} label="Name" name="name" />

          <TextAreaField
            control={control}
            label="Description"
            name="description"
          />

          <TextInputField
            control={control}
            label="Documentation url"
            name="documentationUrl"
            placeholder="https://"
          />

          <TextInputField
            control={control}
            label="Code repository url"
            name="codeRepositoryUrl"
            placeholder="https://"
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
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="whitespace-nowrap" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
