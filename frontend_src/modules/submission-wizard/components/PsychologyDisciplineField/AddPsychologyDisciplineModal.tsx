import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PsychologyDiscipline } from "../../../../models";

interface Props {
  show: boolean;
  onClose: () => void;
  onChange: (value: PsychologyDiscipline) => void;
}

export const psychologyDisciplineFormSchema = z.object({
  name: z
    .string()
    .max(255)
    .min(1, { message: "Psychology discipline name is required" }),
});

type ValidationSchema = z.infer<typeof psychologyDisciplineFormSchema>;

export const AddPsychologyDisciplineModal = ({
  show,
  onClose,
  onChange,
}: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(psychologyDisciplineFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: ValidationSchema) => {
    const id = `NEW--${Math.random().toString()}`;
    onChange({
      ...values,
      id,
      isNew: true,
    });

    reset();
    onClose();
  };

  return (
    <Modal show={show} size="4xl" onClose={onClose}>
      <Modal.Header>Add new psychology discipline</Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField control={control} label="Name" name="name" required />
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
