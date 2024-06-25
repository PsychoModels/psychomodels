import React from "react";
import { Button, Modal } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useStore from "../../store/useStore.ts";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (frameworkId: string | number) => void;
}

const formSchema = z.object({
  name: z.string().max(255).min(1),
  description: z.string().min(1),
  explanation: z.string().min(1),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const FrameworkCreateModal = ({ show, onClose, onSelect }: Props) => {
  const { control, handleSubmit, reset } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", explanation: "" },
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
        <div className="mb-8">
          <TextInputField control={control} label="Name" name="name" />
        </div>

        <div className="mb-8">
          <TextAreaField
            control={control}
            label="Description"
            name="description"
          />
        </div>

        <div className="mb-8">
          <TextAreaField
            control={control}
            label="Explanation"
            name="explanation"
          />
        </div>
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
