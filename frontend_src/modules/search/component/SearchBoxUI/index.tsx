import React, { useEffect } from "react";
import { Spinner, TextInput } from "flowbite-react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

export type SearchBoxUIProps = Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "onReset" | "onChange"
> &
  Pick<React.ComponentProps<"form">, "onSubmit"> &
  Required<Pick<React.ComponentProps<"form">, "onReset">> &
  Pick<React.ComponentProps<"input">, "placeholder" | "autoFocus"> & {
    onChange?: (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.CompositionEvent<HTMLInputElement>,
    ) => void;
    formRef?: React.RefObject<HTMLFormElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    isSearchStalled: boolean;
    value: string;
    sizing?: "sm" | "md" | "lg";
    showSearchIcon?: boolean;
  };

export const SearchBoxUI = ({
  formRef,
  inputRef,
  isSearchStalled,
  onChange,
  onReset,
  onSubmit,
  placeholder = "",
  value,
  autoFocus,
  sizing,
  showSearchIcon,
}: SearchBoxUIProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (onSubmit) {
      onSubmit(event);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onReset(event);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <form
        ref={formRef}
        action=""
        className="relative"
        noValidate
        onSubmit={handleSubmit}
        onReset={handleReset}
        role="search"
      >
        <TextInput
          ref={inputRef}
          aria-label="Search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={placeholder}
          spellCheck={false}
          maxLength={512}
          type="search"
          value={value}
          onChange={onChange}
          onCompositionEnd={onChange}
          autoFocus={autoFocus}
          sizing={sizing}
          icon={showSearchIcon ? MagnifyingGlassIcon : undefined}
        />

        <button
          className="absolute right-0 top-0"
          type="reset"
          title={"translations.resetButtonTitle"}
          hidden={value.length === 0 || isSearchStalled}
        >
          {sizing === "lg" ? (
            <XMarkIcon height={30} className="mt-3 mr-3 text-gray-400" />
          ) : (
            <XMarkIcon height={20} className="mt-2.5 mr-2.5 text-gray-400" />
          )}
        </button>
        <span
          className="absolute right-3 top-1/2 mt-[-14px]"
          hidden={!isSearchStalled}
        >
          <Spinner aria-label="Spinner button example" size="md" />
        </span>
      </form>
    </div>
  );
};
