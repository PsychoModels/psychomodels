import React from "react";
import { Label, Textarea, Tooltip } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  required?: boolean;
  tooltipText?: string;
}

export const TextAreaField = ({
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
              <Label
                htmlFor={name}
                color={color}
                value={`${label}${required ? "*" : ""}`}
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
            <Textarea
              rows={6}
              color={color}
              ref={ref}
              {...fieldAttrs}
              id={name}
              helperText={fieldState?.error && <>{fieldState?.error.message}</>}
            />
          </div>
        );
      }}
    />
  );
};
