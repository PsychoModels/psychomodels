import React from "react";

import { InternalHighlight } from "./InternalHighlight.tsx";

import type {
  HighlightProps as InternalHighlightProps,
  HighlightClassNames as InternalHighlightClassNames,
} from "instantsearch-ui-components";

export type HighlightClassNames = InternalHighlightClassNames;
export type HighlightProps = Omit<InternalHighlightProps, "classNames"> & {
  classNames?: Partial<HighlightClassNames>;
};

export function Highlight({ ...props }: HighlightProps) {
  return (
    <InternalHighlight
      classNames={{
        root: "",
        highlighted: "bg-yellow-100",
        nonHighlighted: "",
        separator: "",
      }}
      {...props}
    />
  );
}
