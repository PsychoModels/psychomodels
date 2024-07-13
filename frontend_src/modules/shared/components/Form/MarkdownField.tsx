import React from "react";
import { Label } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

const mdParser = new MarkdownIt();

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
}

export const MarkdownField = ({ control, label, name }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => {
        const color = fieldState.invalid ? "failure" : "gray";

        const handleEditorChange = React.useCallback(
          ({ text }: { text: string }) => {
            onChange(text);
          },
          [onChange],
        );

        return (
          <div className="">
            <div className="mb-2 block">
              <Label htmlFor={name} color={color} value={label} />
            </div>
            <MdEditor
              style={{
                height: "500px",
                borderRadius: "0.25rem",
                overflow: "hidden",
                ...(fieldState?.error && { borderColor: "rgb(200 30 30)" }),
              }}
              value={value}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
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
