import React from "react";
import { Label, TextInput } from "flowbite-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  placeholder?: string;
}

export const TextInputField = ({
  control,
  label,
  name,
  placeholder,
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
              <Label htmlFor={name} color={color} value={label} />
            </div>
            <TextInput
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