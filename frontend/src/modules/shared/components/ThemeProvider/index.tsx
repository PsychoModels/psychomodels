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
};

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  return <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>;
};
