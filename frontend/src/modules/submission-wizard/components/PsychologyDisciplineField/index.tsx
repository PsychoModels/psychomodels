import React from "react";
import { MultiSelectCombobox } from "../../../shared/components/MultiSelectCombobox";
import { Control } from "react-hook-form";
import useStore from "../../store/useStore.ts";

interface Props {
  control: Control<any, any>;
}

export const PsychologyDisciplineField: React.FC<Props> = ({ control }) => {
  const { psychologyDisciplines } = useStore((state) => state);

  return (
    <div>
      <MultiSelectCombobox
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
  );
};
