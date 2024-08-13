import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Alert, Button } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../lib/allauth.ts";

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(8, { message: "The password must contain at least 8 characters" }),
    new_password: z.string().min(8, {
      message: "The new password must contain at least 8 characters",
    }),
    repeat_new_password: z.string().min(8, {
      message: "The repeated new password must contain at least 8 characters",
    }),
  })
  .refine((data) => data.new_password === data.repeat_new_password, {
    path: ["repeat_new_password"], // This indicates which field the error message will be associated with
    message: "Passwords do not match",
  });

type ValidationSchema = z.infer<typeof formSchema>;

export const ChangePasswordForm = () => {
  const [isDone, setIsDone] = React.useState(false);

  const mutation = useMutation({
    mutationFn: (signupData: ValidationSchema) => {
      return changePassword(signupData);
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      repeat_new_password: "",
    },
  });
  const { control, handleSubmit } = formMethods;

  const onSubmit = async (values: ValidationSchema) => {
    await mutation.mutate(values);
  };

  if (isDone) {
    return (
      <>
        <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
          Change password
        </h1>
        <p className="text-sm text-gray-600 leading-6">
          Your password has been successfully changed.
        </p>
      </>
    );
  }

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
      <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Change password
      </h1>
      <form
        className="flex flex-col gap-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {errors?.map((error: any) => (
          <Alert color="failure" key={error.code} data-testid="error-message">
            <span className="font-medium">Error!</span> {error.message}
          </Alert>
        ))}

        <TextInputField
          control={control}
          label="Current password"
          name="current_password"
          placeholder="Current password"
          type="password"
          size="md"
        />
        <TextInputField
          control={control}
          label="New password"
          name="new_password"
          placeholder="New password"
          type="password"
          size="md"
        />
        <div className="-mt-4">
          <TextInputField
            control={control}
            label="Repeat new password"
            name="repeat_new_password"
            placeholder="Repeat new password"
            type="password"
            size="md"
          />
        </div>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          isProcessing={mutation.isPending}
        >
          Change password
        </Button>
      </form>
    </>
  );
};
