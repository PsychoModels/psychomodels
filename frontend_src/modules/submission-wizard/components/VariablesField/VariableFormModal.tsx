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

const ExplanatoryNote = () => (
  <p className="-mt-6 p-3 rounded-lg bg-gray-100 text-sm text-gray-700">
    With “variable” we mean objects in the model that typically vary and are
    related to psychological constructs, physical states, and behavior that are
    or can be measured during research. For instance, (the level of) syndromes
    (e.g., depression), symptoms (e.g., fatigue), mood states (e.g., anger), or
    physical state (e.g., awake/asleep) can be expressed as variables in a
    model. Please note that it is not necessary that these objects actually vary
    within the context of this particular model.
  </p>
);

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
        {existingValue
          ? "Edit model variable"
          : "Add new variable to your model"}
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
                  className="absolute top-0 right-7 text-sm text-tertiary hover:underline cursor-pointer"
                  onClick={() => setCreateCustomVariable(true)}
                >
                  create new variable
                </div>

                <SelectComboboxField
                  control={control}
                  label="Name*"
                  name="variableId"
                  placeholder="Select a variable"
                  options={variableOptions}
                  tooltipText="Select an existing variable name if one fits your model’s variable. If you need to add a new variable, press “create custom variable” and give it a short but recognizable name. Please use a conventional name if one exists."
                />
              </div>

              <ExplanatoryNote />

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
                  className="absolute top-0 right-7 text-sm text-tertiary hover:underline cursor-pointer"
                  onClick={() => setCreateCustomVariable(false)}
                >
                  select existing variable
                </div>
                <TextInputField
                  control={control}
                  label="Name"
                  name="variableName"
                  required
                  tooltipText="Select an existing variable name if one fits your model’s variable. If you need to add a new variable, press “create custom variable” and give it a short but recognizable name. Please use a conventional name if one exists."
                />
              </div>

              <ExplanatoryNote />

              <TextAreaField
                control={control}
                label="Description"
                name="variableDescription"
                required
                tooltipText="Give a general description of what the variable is about, also outside the context of the model (e.g., how “fatigue” is about the feeling of tiredness, lack of energy, etc."
              />
            </>
          )}

          <TextInputField
            control={control}
            label="Label"
            name="name"
            required
            tooltipText="How the variable is designated in model’s equations or code."
          />

          <TextAreaField
            control={control}
            label="Details"
            name="details"
            tooltipText="Remaining details that might be relevant, such as measurement scale, constructs to which it belongs, the role it has within the model, etc."
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
