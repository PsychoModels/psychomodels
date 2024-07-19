import { SelectField } from "../../../shared/components/Form/SelectField.tsx";
import React from "react";
import { Control, Controller } from "react-hook-form";
import useStore from "../../store/useStore.ts";
import { AddProgrammingLanguageModal } from "./AddProgrammingLanguageModal.tsx";

interface Props {
  control: Control<any, any>;
}
export const ProgrammingLanguageSelectField = ({ control }: Props) => {
  const { programmingLanguages, addProgrammingLanguage } = useStore(
    (state) => state,
  );
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="relative">
        <div
          className="absolute top-0 right-0 text-sm text-gray-500 hover:text-cyan-800 cursor-pointer"
          onClick={() => setShowModal(true)}
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
