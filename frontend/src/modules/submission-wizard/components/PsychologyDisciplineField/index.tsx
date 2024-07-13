import React from "react";
import { MultiSelectComboboxField } from "../../../shared/components/MultiSelectComboboxField";
import { Control, Controller } from "react-hook-form";
import useStore from "../../store/useStore.ts";
import { AddPsychologyDisciplineModal } from "./AddPsychologyDisciplineModal.tsx";

interface Props {
  control: Control<any, any>;
}

export const PsychologyDisciplineField: React.FC<Props> = ({ control }) => {
  const { psychologyDisciplines, addPsychologyDiscipline } = useStore(
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
          add new discipline
        </div>
        <MultiSelectComboboxField
          control={control}
          label="Psychology disciplines"
          name="psychologyDisciplineIds"
          placeholder="Select or search for psychology disciplines"
          options={psychologyDisciplines.map((discipline) => ({
            label: discipline.name,
            value: discipline.id,
          }))}
        />
      </div>
      <Controller
        name="psychologyDisciplineIds"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <AddPsychologyDisciplineModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onChange={(newItem) => {
                addPsychologyDiscipline(newItem);
                onChange([...value, newItem.id]);
              }}
            />
          );
        }}
      ></Controller>
    </>
  );
};
