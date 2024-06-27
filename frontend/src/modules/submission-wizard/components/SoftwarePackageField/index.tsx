import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { SoftwarePackageCard } from "./SoftwarePackageCard.tsx";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { SoftwarePackageFormModal } from "./SoftwarePackageFormModal.tsx";
import { SoftwarePackage } from "../../../../models";
import { RemoveSoftwarePackageButton } from "./RemoveSoftwarePackageButton.tsx";

interface Props {
  control: Control<any, any>;
}

export const SoftwarePackageField = ({ control }: Props) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editExistingValue, setEditExistingValue] =
    useState<SoftwarePackage | null>(null);

  return (
    <Controller
      name="softwarePackages"
      control={control}
      render={({ field: { value, onChange }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="softwarePackages"
                color={color}
                value="Software packages"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {value?.map((softwarePackage: SoftwarePackage) => {
                return (
                  <SoftwarePackageCard
                    key={softwarePackage.id}
                    softwarePackage={softwarePackage}
                    actionButton={
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={() => {
                            setEditExistingValue(softwarePackage);
                            setCreateModalIsOpen(true);
                          }}
                        >
                          Edit <PencilSquareIcon height={16} className="ml-2" />
                        </Button>

                        <RemoveSoftwarePackageButton
                          onRemove={() => {
                            onChange(
                              value.filter(
                                ({ id }: { id: string | number }) =>
                                  id !== softwarePackage.id,
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
                className={`${value.length > 0 ? "mt-6" : ""}`}
                onClick={() => {
                  setEditExistingValue(null);
                  setCreateModalIsOpen(true);
                }}
              >
                Add software package <PlusIcon height="20" className="ml-3" />
              </Button>
            </div>

            {fieldState?.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {fieldState?.error.message}
              </p>
            )}

            {createModalIsOpen && (
              <SoftwarePackageFormModal
                show={createModalIsOpen}
                onClose={() => setCreateModalIsOpen(false)}
                existingValue={editExistingValue}
                onChange={(softwarePackage: SoftwarePackage) => {
                  if (editExistingValue) {
                    const updatedValue = value.map((sp: SoftwarePackage) =>
                      sp.id === softwarePackage.id ? softwarePackage : sp,
                    );
                    onChange(updatedValue);
                  } else {
                    onChange([...value, softwarePackage]);
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
