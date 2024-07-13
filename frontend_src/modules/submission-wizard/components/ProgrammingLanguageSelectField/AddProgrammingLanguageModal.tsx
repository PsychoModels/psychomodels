import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProgrammingLanguage } from "../../../../models";

interface Props {
  show: boolean;
  onClose: () => void;
  onChange: (value: ProgrammingLanguage) => void;
}

export const programmingLanguageFormSchema = z.object({
  name: z.string().max(255).min(1),
});

type ValidationSchema = z.infer<typeof programmingLanguageFormSchema>;

export const AddProgrammingLanguageModal = ({
  show,
  onClose,
  onChange,
}: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(programmingLanguageFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: ValidationSchema) => {
    const id = `NEW--${Math.random().toString()}`;
    onChange({
      ...values,
      id,
    });

    reset();
    onClose();
  };

  return (
    <Modal show={show} size="4xl" onClose={onClose}>
      <Modal.Header>Add new programming language</Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField control={control} label="Name" name="name" />
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
