import React, { useState } from "react";
import useStore from "../../store/useStore.ts";
import { Button, Label, Tooltip } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { FrameworkCard } from "./FrameworkCard.tsx";
import { PlusIcon } from "@heroicons/react/24/solid";
import { FrameworkSelectModal } from "./FrameworkSelectModal.tsx";
import { FrameworkCreateModal } from "./FrameworkCreateModal.tsx";
import { RemoveFrameworkButton } from "./RemoveFrameworkButton.tsx";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  tooltipText?: string;
}

export const ModelingFrameworkField = ({ control, tooltipText }: Props) => {
  const { frameworks } = useStore((state) => state);
  const [selectModalIsOpen, setSelectModalIsOpen] = useState(false);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  return (
    <Controller
      name="frameworkIds"
      control={control}
      render={({ field: { value, onChange }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="frameworkIds"
                color={color}
                value="Modeling frameworks*"
              />

              {tooltipText && (
                <div className="float-right">
                  <Tooltip content={tooltipText} placement="left">
                    <div className="w-5 h-5">
                      <QuestionMarkCircleIcon color="#244657" />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {value.map((frameworkId: string) => {
                const framework = frameworks.find((f) => f.id === frameworkId);

                if (!framework) return null;

                return (
                  <FrameworkCard
                    key={frameworkId}
                    framework={framework}
                    actionButton={
                      <RemoveFrameworkButton
                        isNew={Boolean(framework.isNew)}
                        onRemove={() =>
                          onChange(
                            value.filter(
                              (id: string | number) => id !== frameworkId,
                            ),
                          )
                        }
                      />
                    }
                  />
                );
              })}
              <div
                className={`${value.length > 0 ? "w-full flex items-center justify-center min-h-[100px]" : ""}`}
              >
                <Button
                  className="whitespace-nowrap"
                  onClick={() => {
                    setSelectModalIsOpen(true);
                  }}
                  data-testid="select-framework-button"
                >
                  Select framework <PlusIcon height="20" className="ml-3" />
                </Button>
              </div>
            </div>

            {fieldState?.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {fieldState?.error.message}
              </p>
            )}

            <FrameworkSelectModal
              selectedFrameworkIds={value}
              show={selectModalIsOpen}
              onClose={() => setSelectModalIsOpen(false)}
              onSelect={(frameworkId) => {
                onChange([frameworkId, ...value]);
              }}
              onClickCreateNew={() => {
                setSelectModalIsOpen(false);
                setCreateModalIsOpen(true);
              }}
            />

            <FrameworkCreateModal
              show={createModalIsOpen}
              onClose={() => setCreateModalIsOpen(false)}
              onSelect={(frameworkId) => {
                onChange([frameworkId, ...value]);
              }}
            />
          </div>
        );
      }}
    />
  );
};
