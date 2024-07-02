import React from "react";
import { Label, TextInput } from "flowbite-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
}

export const TextInputField = ({
  control,
  label,
  name,
  placeholder,
  type = "text",
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
              <Label htmlFor={name} color={color} value={label} />
            </div>
            <TextInput
              type={type}
              color={color}
              ref={ref}
              {...fieldAttrs}
              sizing="lg"
              placeholder={placeholder}
              helperText={fieldState?.error && <>{fieldState?.error.message}</>}
            />
          </div>
        );
      }}
    />
  );
};
