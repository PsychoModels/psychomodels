import React, { useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch-core";

import { SearchBoxUI, SearchBoxUIProps } from "../SearchBoxUI";

type UiProps = Pick<
  SearchBoxUIProps,
  | "inputRef"
  | "isSearchStalled"
  | "onChange"
  | "onReset"
  | "onSubmit"
  | "value"
  | "autoFocus"
>;

export const SearchBox = () => {
  const { query, refine, isSearchStalled } = useSearchBox(
    {},
    { $$widgetType: "ais.searchBox" },
  );
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const ignoreCompositionEvents = false;
  const searchAsYouType = true;

  function setQuery(newQuery: string, isComposing = false) {
    setInputValue(newQuery);

    if (searchAsYouType && !(ignoreCompositionEvents && isComposing)) {
      refine(newQuery);
    }
  }

  function onReset() {
    setQuery("");

    if (!searchAsYouType) {
      refine("");
    }
  }

  function onChange(event: any) {
    setQuery(
      event.currentTarget.value,
      (event.nativeEvent as KeyboardEvent).isComposing,
    );
  }

  function onSubmit() {
    if (!searchAsYouType) {
      refine(inputValue);
    }
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && document.activeElement !== inputRef.current) {
    setInputValue(query);
  }

  const uiProps: UiProps = {
    inputRef,
    isSearchStalled,
    onChange,
    onReset,
    onSubmit,
    value: inputValue,
  };

  return (
    <SearchBoxUI
      sizing="lg"
      showSearchIcon
      {...uiProps}
      placeholder="Search for psychology models in our database"
    />
  );
};
