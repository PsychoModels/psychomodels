import React from "react";
import { Label, Textarea } from "flowbite-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  required?: boolean;
}

export const TextAreaField = ({
  control,
  label,
  name,
  required = false,
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
