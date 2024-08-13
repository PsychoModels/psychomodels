import React from "react";
import CopyIcon from "../Icons/CopyIcon.tsx";

interface Props {
  text: string;
}

// TODO: add copied animation

export const CopyToClipboardButton = ({ text }: Props) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      aria-label="Copy to clipboard"
      type="button"
      onClick={handleCopy}
      className="border border-gray-300 bg-gray-100 p-1.5 hover:bg-gray-200 cursor-pointer"
    >
      <CopyIcon width={12} />
    </button>
  );
};
