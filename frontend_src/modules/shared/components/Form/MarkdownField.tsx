import React from "react";
import { Label } from "flowbite-react";
import { Control, Controller } from "react-hook-form";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { MathJax } from "better-react-mathjax";
import NewWindowIcon from "../Icons/NewWindowIcon.tsx";

const mdParser = new MarkdownIt();

interface Props {
  control: Control<any, any>;
  label: string;
  name: string;
  showExplanation?: boolean;
}

export const MarkdownField = ({
  control,
  label,
  name,
  showExplanation = true,
}: Props) => {
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
            <MathJax dynamic={true}>
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
                name={name}
              />
            </MathJax>

            {showExplanation && (
              <div className="mt-2 p-3 rounded-lg bg-gray-100 text-sm text-gray-700">
                <p className="mb-1">
                  This is a rich-text field. You can use markdown syntax to
                  stylize your text. If you are not familiar with markdown
                  already, feel free to consult this{" "}
                  <a
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    className="inline-flex text-sm items-center text-tertiary hover:underline"
                    rel="noreferrer"
                  >
                    guide
                    <NewWindowIcon />
                  </a>
                  .
                </p>
                <p className="mb-1">
                  Equations can be added with LaTeX syntax. The equations are
                  rendered via MathJax and must be placed between opening and
                  closing double dollar signs $$.
                </p>
                <p>
                  Code boxes can be created by opening and closing with three
                  backticks ```.
                </p>
              </div>
            )}

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
