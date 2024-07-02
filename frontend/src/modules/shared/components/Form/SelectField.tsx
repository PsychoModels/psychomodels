import React from "react";
import { Label, Select } from "flowbite-react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const SelectField = ({
  control,
  label,
  name,
  options,
  placeholder = "Select an option",
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, ...fieldAttrs }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        console.debug("fieldState: ", value);

        return (
          <div className="">
            <div className="mb-2 block">
              <Label htmlFor={name} color={color} value={label} />
            </div>
            <Select
              sizing="lg"
              defaultValue=""
              id={name}
              color={color}
              ref={ref}
              {...fieldAttrs}
              helperText={fieldState?.error && <>{fieldState?.error.message}</>}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => {
                return (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </div>
        );
      }}
    />
  );
};
