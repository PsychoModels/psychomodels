import React from "react";
import { Label, TextInput, Tooltip } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { FlowbiteTextInputSizes } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  size?: keyof FlowbiteTextInputSizes;
  required?: boolean;
  tooltipText?: string;
}

export const TextInputField = ({
  control,
  label,
  name,
  placeholder,
  type = "text",
  size = "lg",
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
          <div className="flex-1">
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
            <TextInput
              required={required}
              id={name}
              type={type}
              color={color}
              ref={ref}
              {...fieldAttrs}
              sizing={size}
              placeholder={placeholder}
              helperText={fieldState?.error && <>{fieldState?.error.message}</>}
            />
          </div>
        );
      }}
    />
  );
};
