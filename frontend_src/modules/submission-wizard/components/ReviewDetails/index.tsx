import React, { useCallback, useEffect } from "react";
import useStore from "../../store/useStore.ts";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button } from "flowbite-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ReviewForm } from "./ReviewForm.tsx";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  prepareSubmissionData,
  PsychologyModelSubmissionData,
} from "../../util/prepareSubmissionData.ts";
import { getCSRFToken } from "../../../account/lib/django.ts";
import { resetAllSlices } from "../../store/resetSlice.ts";
import { SaveAsDraftButton } from "../SaveAsDraftButton";

const formSchema = z.object({
  remarks: z.string(),
  termsOfAgreement: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms of agreement.",
  }),
});

export type ValidationSchema = z.infer<typeof formSchema>;

const STEP_TITLES = {
  submissionGuidelines: "Submission guidelines",
  account: "Login to your account",
  modelInformation: "Model summary",
  publicationDetails: "Model Details",
};

const STEP_LINKS = {
  submissionGuidelines: "/",
  account: "/account",
  modelInformation: "/model-summary",
  publicationDetails: "/publication-details",
};

export const ReviewDetails = () => {
  const navigate = useNavigate({ from: "/review" });

  const storeState = useStore((state) => state);

  const { reviewDetails, setReviewDetails, completedStatus } = storeState;

  const { control, handleSubmit, getValues, reset } = useForm<ValidationSchema>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: { ...reviewDetails },
    },
  );

  const mutation = useMutation({
    mutationFn: (submissionData: PsychologyModelSubmissionData) => {
      return axios.post("/api/psychology_models/  ", submissionData, {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    },
    onSuccess: () => {
      reset({});
      resetAllSlices();
      navigate({ to: "/thank-you" });
    },
  });

  const onSubmit: (values: ValidationSchema) => void = (
    values: ValidationSchema,
  ) => {
    setReviewDetails({ ...reviewDetails, ...values });

    mutation.mutate(
      prepareSubmissionData({ ...storeState, reviewDetails: values }),
    );
  };

  useEffect(() => {
    return function saveFormState() {
      const values = getValues();
      setReviewDetails({ ...reviewDetails, ...values });
    };
  }, []);

  const onNavigateBack = () => {
    navigate({ to: "/publication-details" });
  };

  const readyToSubmit = Object.entries(completedStatus).every(
    ([key, value]) => {
      if (key === "review") return true;
      return value;
    },
  );

  const beforeSaveDraft = useCallback(() => {
    const values = getValues();
    setReviewDetails({ ...reviewDetails, ...values });
  }, []);

  return (
    <>
      <div className="px-6 py-8">
        {!readyToSubmit && (
          <ul>
            {Object.entries(completedStatus).map(([key, value]) => {
              if (key === "review" || value) return null;

              return (
                <li key={key}>
                  You have not completed the{" "}
                  <Link
                    to={STEP_LINKS[key as keyof typeof STEP_LINKS]}
                    className="text-tertiary hover:underline"
                  >
                    {STEP_TITLES[key as keyof typeof STEP_TITLES]} step
                  </Link>
                  . Please go back to review this step.
                </li>
              );
            })}
          </ul>
        )}

        {readyToSubmit && (
          <ReviewForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        )}
      </div>
      <div className="md:hidden flex justify-end">
        <SaveAsDraftButton asLink beforeSaveDraft={beforeSaveDraft} />
      </div>

      {mutation.isError && (
        <Alert color="failure" className="m-4">
          An error occurred. Please try again.
          <br />
        </Alert>
      )}

      <div className="flex bg-gray-50 space-x-6 p-6 border-t" color="gray">
        <Button type="button" color="gray" onClick={onNavigateBack}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={!readyToSubmit || mutation.isPending}
          isProcessing={mutation.isPending}
        >
          Submit Psychology model
        </Button>
        <div className="!ml-auto hidden md:block">
          <SaveAsDraftButton beforeSaveDraft={beforeSaveDraft} />
        </div>
      </div>
    </>
  );
};
