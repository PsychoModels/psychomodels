import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useStore from "../../store/useStore.ts";
import { DOIInputField } from "../DOIInputField";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (frameworkId: string | number) => void;
}

const formSchema = z.object({
  name: z.string().max(255).min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  explanation: z
    .string()
    .min(1, { message: "How does the model work is required" }),
  publicationDOI: z.union([
    z.literal(""),
    z.string().regex(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i, {
      message: "Invalid publication DOI",
    }),
  ]),
  documentationUrl: z.union([
    z.literal(""),
    z.string().trim().url({ message: "Invalid documentation URL" }),
  ]),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const FrameworkCreateModal = ({ show, onClose, onSelect }: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      explanation: "",
      publicationDOI: "",
      documentationUrl: "",
    },
  });

  const { addFramework } = useStore((state) => state);

  const onSubmit = (values: ValidationSchema) => {
    const id = `NEW--${Math.random().toString()}`;
    addFramework({
      id,
      isNew: true,
      ...values,
    });

    reset();

    onSelect(id);
    onClose();
  };

  return (
    <Modal show={show} size="6xl" onClose={onClose}>
      <Modal.Header>Create new modeling framework</Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField control={control} label="Name" name="name" required />

          <TextAreaField
            control={control}
            label="Description"
            name="description"
            required
          />

          <TextAreaField
            control={control}
            label="How does it work"
            name="explanation"
            required
          />

          <DOIInputField
            control={control}
            label="Publication DOI"
            name="publicationDOI"
          />

          <TextInputField
            control={control}
            label="Documentation url"
            name="documentationUrl"
            placeholder="https://"
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
