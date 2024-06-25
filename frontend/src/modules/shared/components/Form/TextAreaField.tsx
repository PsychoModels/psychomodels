import React from "react";
import { Label, Textarea } from "flowbite-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
}

export const TextAreaField = ({ control, label, name }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...fieldAttrs }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div className="">
            <div className="mb-2 block">
              <Label htmlFor="username4" color={color} value={label} />
            </div>
            <Textarea
              rows={6}
              required
              color={color}
              ref={ref}
              {...fieldAttrs}
              helperText={fieldState?.error && <>{fieldState?.error.message}</>}
            />
          </div>
        );
      }}
    />
  );
};
