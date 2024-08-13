import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Alert, Button } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { SelectField } from "../../../shared/components/Form/SelectField.tsx";
import useStore from "../../../submission-wizard/store/useStore.ts";
import axios from "axios";
import { getCSRFToken } from "../../lib/django.ts";

const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  university: z.string().min(1),
  department: z.string().min(1),
  country: z.string().min(2).min(2),
});

type ValidationSchema = z.infer<typeof formSchema>;

interface Props {
  onSaveSuccess: () => void;
  initialValues: ValidationSchema;
}

export const ProfileForm = ({ onSaveSuccess, initialValues }: Props) => {
  const mutation = useMutation({
    mutationFn: (profileData: ValidationSchema) => {
      return axios.put("/api/user/profile/  ", profileData, {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    },
    onSuccess: () => {
      onSaveSuccess();
    },
  });

  const { countries } = useStore((state) => state);

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  const { control, handleSubmit } = formMethods;

  const onSubmit = (values: ValidationSchema) => {
    mutation.mutate(values);
  };

  const errors = mutation.isError
    ? // @ts-ignore
      mutation?.error?.response?.data?.errors || [
        {
          code: "general-error",
          message: "A general error occurred. Please try again.",
        },
      ]
    : [];

  return (
    <>
      <form
        className="flex flex-col gap-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {errors?.map((error: any) => (
          <Alert color="failure" key={error.code}>
            <span className="font-medium">Error!</span> {error.message}
          </Alert>
        ))}
        <TextInputField
          control={control}
          label="First name"
          required
          name="first_name"
          size="lg"
        />

        <TextInputField
          control={control}
          label="Last name"
          required
          name="last_name"
          size="lg"
        />

        <TextInputField
          control={control}
          label="University"
          required
          name="university"
          size="lg"
        />

        <TextInputField
          control={control}
          label="Department"
          required
          name="department"
          size="lg"
        />
        <SelectField
          control={control}
          label="Country*"
          name="country"
          placeholder="Select a country"
          options={countries.map((country) => ({
            label: country.name,
            value: country.code,
          }))}
        />

        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          isProcessing={mutation.isPending}
        >
          Save profile
        </Button>
      </form>
    </>
  );
};
