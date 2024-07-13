import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ModelVariable } from "../../../../models";

interface Props {
  show: boolean;
  onClose: () => void;
  existingValue: ModelVariable | null;
  onChange: (value: ModelVariable) => void;
}

export const variableFormSchema = z.object({
  name: z.string().max(255).min(1),
  description: z.string(),
});

type ValidationSchema = z.infer<typeof variableFormSchema>;

export const VariableFormModal = ({
  show,
  onClose,
  existingValue,
  onChange,
}: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(variableFormSchema),
    defaultValues: existingValue || {
      name: "",
      description: "",
    },
  });

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
        {existingValue ? "Edit variable" : "Add new variable"}
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
