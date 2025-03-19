import { SelectField } from "../../../shared/components/Form/SelectField.tsx";
import React from "react";
import { Control, Controller } from "react-hook-form";
import useStore from "../../store/useStore.ts";
import { AddProgrammingLanguageModal } from "./AddProgrammingLanguageModal.tsx";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  control: Control<any, any>;
  tooltipText?: string;
}
export const ProgrammingLanguageSelectField = ({
  control,
  tooltipText,
}: Props) => {
  const { programmingLanguages, addProgrammingLanguage } = useStore(
    (state) => state,
  );
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="relative">
        {tooltipText && (
          <div className="float-right ml-3">
            <Tooltip content={tooltipText} placement="left">
              <div className="w-5 h-5">
                <QuestionMarkCircleIcon color="#244657" />
              </div>
            </Tooltip>
          </div>
        )}
        <div
          className="float-right text-sm text-gray-500 hover:text-cyan-800 cursor-pointer"
          onClick={() => setShowModal(true)}
          data-testid="add-programming-language-button"
        >
          add new language
        </div>
        <SelectField
          control={control}
          label="Programming language"
          name="programmingLanguageId"
          placeholder="Select a programming language"
          options={programmingLanguages.map((language) => ({
            label: language.name,
            value: language.id,
          }))}
        />
      </div>
      <Controller
        name="programmingLanguageId"
        control={control}
        render={({ field: { onChange } }) => {
          return (
            <AddProgrammingLanguageModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onChange={(newItem) => {
                addProgrammingLanguage(newItem);
                setTimeout(() => {
                  onChange(newItem.id);
                });
              }}
            />
          );
        }}
      ></Controller>
    </>
  );
};
