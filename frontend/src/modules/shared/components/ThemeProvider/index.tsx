import React from "react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      info: "border border-transparent bg-secondary text-white enabled:hover:bg-primary",
    },
  },
  label: {
    root: {
      base: "text-gray-600",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {},
      },
    },
  },
  textarea: {
    base: "block w-full rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  table: {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow:
        "absolute left-0 top-0 -z-10 h-full w-full rounded-lg dark:bg-black",
      wrapper: "relative",
    },
    body: {
      base: "group/body",
      cell: {
        base: "px-4 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg",
      },
    },
    head: {
      base: "group/head text-xs text-secondary dark:text-gray-400",
      cell: {
        base: "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
      },
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped:
        "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
    },
  },
};

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  return <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>;
};
