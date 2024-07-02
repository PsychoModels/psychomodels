import React from "react";
import { Control } from "react-hook-form";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { DOIInputField } from "../DOIInputField";

interface Props {
  control: Control<any, any>;
}

export const PublicationSubForm = ({ control }: Props) => {
  return (
    <>
      <h2 className="text-cyan-700 text-lg text-md font-bold md:text-2xl mt-8">
        Publication
      </h2>
      <DOIInputField
        control={control}
        label="DOI or publication url"
        name="publication.url"
      />

      <TextInputField
        control={control}
        label="Title"
        name="publication.title"
      />

      <div className="flex flex-row gap-8">
        <TextInputField
          control={control}
          label="Journal"
          name="publication.journal"
        />

        <TextInputField
          control={control}
          label="Publisher"
          name="publication.publisher"
        />
      </div>

      <div className="flex flex-row gap-8">
        <TextInputField
          control={control}
          label="year"
          name="publication.year"
          type="number"
        />

        <TextInputField
          control={control}
          label="volume"
          name="publication.volume"
          type="number"
        />
      </div>
    </>
  );
};
