import React, { useRef, useState } from "react";
import { useRefinementList } from "react-instantsearch-core";

import { SearchBoxUI as SearchBoxUiComponent } from "../SearchBoxUI";

import type { RefinementListProps as RefinementListUiComponentProps } from "./RefinementListUi.tsx";

import type { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import type { RefinementListWidgetParams } from "instantsearch.js/es/widgets/refinement-list/refinement-list";
import type { UseRefinementListProps } from "react-instantsearch-core";
import { RefinementListUi } from "./RefinementListUi.tsx";

type UiProps = Pick<
  RefinementListUiComponentProps,
  | "canRefine"
  | "items"
  | "onRefine"
  | "query"
  | "searchBox"
  | "noResults"
  | "canToggleShowMore"
  | "onToggleShowMore"
  | "isShowingMore"
>;

export type RefinementListProps = Omit<
  RefinementListUiComponentProps,
  keyof UiProps
> &
  UseRefinementListProps &
  Pick<RefinementListWidgetParams, "searchablePlaceholder">;

export function RefinementList({
  searchablePlaceholder,
  attribute,
  operator,
  limit,
  showMore = true,
  showMoreLimit,
  sortBy,
  escapeFacetValues,
  transformItems,
  ...props
}: RefinementListProps) {
  const {
    canRefine,
    canToggleShowMore,
    isFromSearch,
    isShowingMore,
    items,
    refine,
    searchForItems,
    toggleShowMore,
  } = useRefinementList(
    {
      attribute,
      operator,
      limit,
      showMore,
      showMoreLimit,
      sortBy,
      escapeFacetValues,
      transformItems,
    },
    {
      $$widgetType: "ais.refinementList",
    },
  );
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(newQuery: string, compositionComplete = true) {
    setInputValue(newQuery);
    if (compositionComplete) {
      searchForItems(newQuery);
    }
  }

  function onRefine(item: RefinementListItem) {
    refine(item.value);
    setQuery("");
  }

  function onChange(event: any) {
    const compositionComplete =
      event.type === "compositionend" ||
      !(event.nativeEvent as KeyboardEvent).isComposing;

    setQuery(event.currentTarget.value, compositionComplete);
  }

  function onReset() {
    setQuery("");
  }

  function onSubmit() {
    if (items.length > 0) {
      refine(items[0].value);
      setQuery("");
    }
  }

  const uiProps: UiProps = {
    items,
    canRefine,
    onRefine,
    query: inputValue,
    searchBox: (
      <SearchBoxUiComponent
        inputRef={inputRef}
        placeholder={searchablePlaceholder}
        isSearchStalled={false}
        value={inputValue}
        onChange={onChange}
        onReset={onReset}
        onSubmit={onSubmit}
      />
    ),
    noResults: isFromSearch && items.length === 0 && "no results",
    canToggleShowMore,
    onToggleShowMore: toggleShowMore,
    isShowingMore,
  };

  return (
    <RefinementListUi
      {...props}
      {...uiProps}
      showMore={showMore}
      attribute={attribute}
    />
  );
}
