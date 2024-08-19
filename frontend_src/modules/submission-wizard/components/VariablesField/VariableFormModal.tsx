import React, { useEffect, useMemo } from "react";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { TextInputField } from "../../../shared/components/Form/TextInputField";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ModelVariable, Variable } from "../../../../models";
import useStore from "../../store/useStore.ts";
import { SelectComboboxField } from "../../../shared/components/SelectComboboxField";

interface Props {
  show: boolean;
  onClose: () => void;
  existingValue: ModelVariable | null;
  onChange: (value: ModelVariable) => void;
}

const baseSchema = z.object({
  name: z.string().max(255).min(1, {
    message: "Model variable name is required",
  }),
  details: z.string(),
});

const variableIdSchema = z.object({
  variableId: z.string().min(1).or(z.number().min(1)),
});

const customVariableSchema = z.object({
  variableName: z.string().min(1),
  variableDescription: z.string().min(1),
});

type BaseValidationSchema = z.infer<typeof baseSchema>;
type VariableIdValidationSchema = z.infer<typeof variableIdSchema>;
type CustomValidationSchema = z.infer<typeof customVariableSchema>;

export const VariableFormModal = ({
  show,
  onClose,
  existingValue,
  onChange,
}: Props) => {
  const [createCustomVariable, setCreateCustomVariable] = React.useState(false);

  const schema = createCustomVariable
    ? baseSchema.merge(customVariableSchema)
    : baseSchema.merge(variableIdSchema);

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      variableId: existingValue?.variableId || "",
      variableName: "",
      variableDescription: "",
      name: existingValue?.name || "",
      details: existingValue?.details || "",
    },
  });

  const { variables, addVariable } = useStore((state) => state);

  const [variableDescription, setVariableDescription] = React.useState("");

  const variableIdFieldValue = watch("variableId"); // Watch the field value

  useEffect(() => {
    const selectedVariable = variables.find(
      (variable) => variable.id == variableIdFieldValue,
    );

    setVariableDescription(selectedVariable?.description || "");
  }, [variableIdFieldValue, variables]); // Run the effect whenever fieldValue changes

  const variableOptions = useMemo(
    () =>
      variables.map((variable) => ({
        label: variable.name,
        value: variable.id,
      })),
    [variables],
  );

  const onSubmit = (
    values: BaseValidationSchema &
      VariableIdValidationSchema &
      CustomValidationSchema,
  ) => {
    let variable: Variable;
    if (createCustomVariable) {
      variable = {
        name: values.variableName,
        description: values.variableDescription,
        id: `NEW--${Math.random().toString()}`,
        isNew: true,
      };

      addVariable(variable);
    } else {
      variable = variables.find(
        (variable) => variable.id == values.variableId,
      )!;
    }

    const newModelVariable = {
      name: values.name,
      details: values.details,
      variableId: variable.id,
    };

    if (existingValue) {
      onChange({
        ...newModelVariable,
        id: existingValue.id,
      });
    } else {
      onChange({
        ...newModelVariable,
        id: `NEW--${Math.random().toString()}`,
      });
    }

    reset();
    onClose();
  };

  return (
    <Modal show={show} size="6xl" onClose={onClose}>
      <Modal.Header>
        {existingValue ? "Edit model variable" : "Add new model variable"}
      </Modal.Header>
      <Modal.Body>
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {!createCustomVariable && (
            <>
              <div className="relative">
                <div
                  className="absolute top-0 right-0 text-sm text-gray-500 hover:text-cyan-800 cursor-pointer"
                  onClick={() => setCreateCustomVariable(true)}
                >
                  create custom variable
                </div>

                <SelectComboboxField
                  control={control}
                  label="Variable*"
                  name="variableId"
                  placeholder="Select a variable"
                  options={variableOptions}
                />
              </div>

              <div className="">
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea rows={3} disabled value={variableDescription} />
              </div>
            </>
          )}
          {createCustomVariable && (
            <>
              <div className="relative">
                <div
                  className="absolute top-0 right-0 text-sm text-gray-500 hover:text-cyan-800 cursor-pointer"
                  onClick={() => setCreateCustomVariable(false)}
                >
                  select existing variable
                </div>
                <TextInputField
                  control={control}
                  label="Variable"
                  name="variableName"
                  required
                />
              </div>

              <TextAreaField
                control={control}
                label="Description"
                name="variableDescription"
                required
              />
            </>
          )}

          <TextInputField control={control} label="Name" name="name" required />

          <TextAreaField control={control} label="Details" name="details" />
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
