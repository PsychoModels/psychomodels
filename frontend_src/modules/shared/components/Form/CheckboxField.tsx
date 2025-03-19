import React from "react";
import { Checkbox, Label, Tooltip } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  required?: boolean;
  tooltipText?: string;
}

export const CheckboxField = ({
  control,
  label,
  name,
  required = false,
  tooltipText,
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...fieldAttrs }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div className="">
            <div className="mb-2 block">
              <Checkbox color={color} ref={ref} {...fieldAttrs} id={name} />

              <Label
                htmlFor={name}
                color={color}
                value={`${label}${required ? "*" : ""}`}
                className="ml-3 vertical-middle"
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

            {fieldState?.error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {fieldState?.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
