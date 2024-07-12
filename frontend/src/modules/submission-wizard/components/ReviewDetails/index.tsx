import React from "react";
import useStore from "../../store/useStore.ts";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { PsychologyModelDetail } from "../PsychologyModelDetail";
import { PsychologyModel } from "../../../../models";

const formSchema = z.object({
  remarks: z.string(),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const ReviewDetails = () => {
  const {
    reviewDetails,
    setReviewDetails,
    goToStep,
    modelInformation,
    publicationDetails,
    programmingLanguages,
    frameworks,
    psychologyDisciplines,
  } = useStore((state) => state);

  const { control, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...reviewDetails },
  });

  const onSubmit = (values: ValidationSchema) => {
    setReviewDetails({ ...reviewDetails, ...values });

    // Todo
  };

  const psychologyModel: PsychologyModel = {
    ...modelInformation,
    ...publicationDetails,
    programmingLanguage: programmingLanguages.find(
      (pl) => pl.id === publicationDetails.programmingLanguageId,
    )!,
    frameworks: modelInformation.frameworkIds.map(
      (id) => frameworks.find((f) => f.id === id)!,
    ),
    psychologyDisciplines: modelInformation.psychologyDisciplineIds.map(
      (id) => psychologyDisciplines.find((pd) => pd.id === id)!,
    ),
  };

  return (
    <>
      <div className="px-6 py-8">
        <form
          className="flex flex-col gap-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <PsychologyModelDetail psychologyModel={psychologyModel} />

          <h2 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
            Remarks
          </h2>

          <TextAreaField control={control} label="Do you have any remarks, feedback or extra details you want to share about this submission?" name="remarks" />
        </form>
      </div>
      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={() => goToStep(4)}>
          Back
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Submit Psychology model
        </Button>
      </div>
    </>
  );
};
