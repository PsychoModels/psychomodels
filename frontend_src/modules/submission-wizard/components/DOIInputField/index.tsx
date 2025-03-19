import React from "react";
import { Label, TextInput, Tooltip } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import { FetchDOIButton } from "./FetchDOIButton.tsx";
import { PublicationMeta } from "./PublicationMeta.tsx";
import { removeDoiUrlPrefix } from "./util.ts";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  placeholder?: string;
  tooltipText?: string;
}

export const DOIInputField = ({
  control,
  label,
  name,
  placeholder,
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
              <Label htmlFor={name} color={color} value={label} />
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
                className="extra-padding-for-doi-button"
                id={name}
              />

              <FetchDOIButton doiValue={fieldAttrs.value} />
            </div>
            <PublicationMeta doiValue={fieldAttrs.value}>
              {(publication) => (
                <div className="bg-gray-50 rounded-lg p-3 table-auto mt-4 text-sm shadow-md">
                  {publication}
                </div>
              )}
            </PublicationMeta>
          </div>
        );
      }}
    />
  );
};
