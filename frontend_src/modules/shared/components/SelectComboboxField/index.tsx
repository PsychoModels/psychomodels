import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Label } from "flowbite-react";

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const SelectComboboxField: React.FC<Props> = ({
  control,
  name,
  label,
  options,
  placeholder,
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        return (
          <div>
            <div className="mb-2 block">
              <Label htmlFor={name} color={color} value={label} />
            </div>

            <Combobox
              as="div"
              value={value}
              immediate
              onChange={(selectedValue) => {
                onChange(selectedValue);
              }}
            >
              <div className="relative mt-2">
                <ComboboxInput
                  className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-4 sm:text-base rounded-lg"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(option: any) => option?.label}
                  placeholder={placeholder}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>

                {filteredOptions.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border-gray-300 bg-gray-50 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredOptions.map((option) => (
                      <ComboboxOption
                        key={option.value}
                        value={option.value}
                        className={({ focus }) =>
                          classNames(
                            "relative cursor-pointer select-none py-2 pl-3 pr-9",
                            focus
                              ? "bg-secondary  text-white"
                              : "text-gray-900",
                          )
                        }
                      >
                        {({ focus, selected }) => (
                          <>
                            <span
                              className={classNames(
                                "block truncate",
                                selected && "font-semibold",
                              )}
                            >
                              {option.label}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  focus ? "text-white" : "text-cyan-800",
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>

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
