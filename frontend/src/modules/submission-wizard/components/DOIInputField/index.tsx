import React from "react";
import { Label, TextInput } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { GetPublicationFromDOIButton } from "./getPublicationFromDOIButton.tsx";
import { PublicationMeta } from "./PublicationMeta.tsx";
import { removeDoiUrlPrefix } from "./util.ts";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  placeholder?: string;
}

export const DOIInputField = ({ control, label, name, placeholder }: Props) => {
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
            <div className="relative">
              <TextInput
                color={color}
                ref={ref}
                {...fieldAttrs}
                sizing="lg"
                placeholder={placeholder}
                onBlur={(e) => {
                  fieldAttrs.onChange(removeDoiUrlPrefix(e.target.value));
                }}
                helperText={
                  fieldState?.error && <>{fieldState?.error.message}</>
                }
              />

              <GetPublicationFromDOIButton doiValue={fieldAttrs.value} />
            </div>
            <PublicationMeta doiValue={fieldAttrs.value} />
          </div>
        );
      }}
    />
  );
};
