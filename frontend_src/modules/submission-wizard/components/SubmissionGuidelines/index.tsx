import React from "react";
import ArrowIcon from "../../../shared/components/Icons/ArrowIcon.tsx";
import useStore from "../../store/useStore.ts";
import { Button } from "flowbite-react";
import { useNavigate } from "@tanstack/react-router";
import NewWindowIcon from "../../../shared/components/Icons/NewWindowIcon.tsx";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../account/lib/allauth.ts";

export const SubmissionGuidelines = () => {
  const navigate = useNavigate({ from: "/" });

  const { setCompletedStatus } = useStore((state) => state);

  const { data: sessionData } = useQuery({
    queryKey: ["auth", "session", "status"],
    queryFn: async () => {
      try {
        const data = await getSession();

        data.loggedIn = true;
        return data;
      } catch (error) {
        // @ts-ignore
        if (error?.response?.status === 401) {
          return { loggedIn: false };
        }
        throw error;
      }
    },
  });

  const onSubmitHandler = () => {
    setCompletedStatus("submissionGuidelines", true);

    // jump over account step if user is already logged in
    if (sessionData && sessionData.loggedIn === true) {
      setCompletedStatus("account", true);
      navigate({ to: "/model-summary" });
    } else {
      navigate({ to: "/account" });
    }
  };

  return (
    <>
      <div className="bg-white px-6 py-8 text-gray-600">
        <div>
          <p className="max-w-screen-md mb-4">
            Mathematical and computational models describing
            psychological/behavioral measurements, systems, or theories can be
            submitted to <strong>Psycho</strong>
            <em>Models</em>, irrespective of the modeling formats or programming
            language they are encoded in or the modeling framework used for
            representing the measurement, system, or theory.
          </p>

          <p className="max-w-screen-md mb-4">
            To submit a model, you need an account and to be logged in. Users
            can log in with their Google or Github accounts.
          </p>

          <p className="max-w-screen-md mb-4">
            The submission is a multi-staged process. Certain aspects are
            mandatory (title, summary, and model details), while others are only
            requested. Non-mandatory details can be submitted later.
          </p>

          <p className="max-w-screen-md mb-4">
            A model can be saved as a draft at any time during the submission
            process. Drafts can be found under your profile to edit and submit
            later.
          </p>

          <p className="max-w-screen-md mb-4">
            To ensure a prompt processing of your model, please go through the
            following checklist before submission.
          </p>

          <ul className="max-w-screen-sm mb-12 list-disc pl-8 space-y-2">
            <li>
              Enter all relevant information in appropriate fields in the
              submission pipeline, which would be useful for processing your
              model
            </li>

            <li>
              Choose a short but meaningful name for your model. Please keep it
              under ten words. For inspiration, visit{" "}
              <a
                href="/models"
                target={"_blank"}
                className="text-tertiary hover:underline inline-flex items-center"
              >
                Explore the models
                <NewWindowIcon />
              </a>
            </li>
            <li>Please check if the URLs you submit work.</li>
          </ul>

          <p className="max-w-screen-md mb-4 font-bold">
            Thank you for contributing to <strong>Psycho</strong>
            <em>Models</em>!
          </p>
        </div>
      </div>

      <div className="flex bg-gray-50 space-x-6 p-6 border-t md:justify-start justify-end">
        <Button type="submit" onClick={onSubmitHandler}>
          Continue <ArrowIcon />
        </Button>
      </div>
    </>
  );
};
