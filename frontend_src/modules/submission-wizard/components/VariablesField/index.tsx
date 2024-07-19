import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { VariableCard } from "./VariableCard.tsx";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { VariableFormModal } from "./VariableFormModal.tsx";
import { ModelVariable } from "../../../../models";
import { RemoveVariableButton } from "./RemoveVariableButton.tsx";

interface Props {
  control: Control<any, any>;
}

export const VariablesField = ({ control }: Props) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editExistingValue, setEditExistingValue] =
    useState<ModelVariable | null>(null);

  return (
    <Controller
      name="modelVariables"
      control={control}
      render={({ field: { value, onChange }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div>
            <div className="mb-2 block">
              <Label htmlFor="modelVariables" color={color} value="Variables" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {value?.map((modelVariable: ModelVariable) => {
                return (
                  <VariableCard
                    key={modelVariable.id}
                    modelVariable={modelVariable}
                    actionButton={
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={() => {
                            setEditExistingValue(modelVariable);
                            setCreateModalIsOpen(true);
                          }}
                        >
                          Edit <PencilSquareIcon height={16} className="ml-2" />
                        </Button>

                        <RemoveVariableButton
                          onRemove={() => {
                            onChange(
                              value?.filter(
                                ({ id }: { id: string | number }) =>
                                  id !== modelVariable.id,
                              ),
                            );
                          }}
                        />
                      </div>
                    }
                  />
                );
              })}
            </div>

            <div>
              <Button
                className={`${value?.length > 0 ? "mt-6" : ""}`}
                onClick={() => {
                  setEditExistingValue(null);
                  setCreateModalIsOpen(true);
                }}
              >
                Add variable <PlusIcon height="20" className="ml-3" />
              </Button>
            </div>

            {fieldState?.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {fieldState?.error.message}
              </p>
            )}

            {createModalIsOpen && (
              <VariableFormModal
                show={createModalIsOpen}
                onClose={() => setCreateModalIsOpen(false)}
                existingValue={editExistingValue}
                onChange={(variable: ModelVariable) => {
                  if (editExistingValue) {
                    const updatedValue = value.map((v: ModelVariable) =>
                      v.id === variable.id ? variable : v,
                    );
                    onChange(updatedValue);
                  } else {
                    onChange([...(value || []), variable]);
                  }
                }}
              />
            )}
          </div>
        );
      }}
    />
  );
};
