import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Alert, Button, Spinner } from "flowbite-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPasswordReset, resetPassword } from "../../lib/allauth.ts";
import { Link, useParams } from "@tanstack/react-router";

const formSchema = z
  .object({
    password: z.string().min(8),
    repeat_password: z.string().min(8),
  })
  .refine((data) => data.password === data.repeat_password, {
    path: ["repeat_password"], // This indicates which field the error message will be associated with
    message: "Passwords do not match",
  });

type ValidationSchema = z.infer<typeof formSchema>;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
        Reset you password
      </h1>
      {children}
    </>
  );
};

export const ResetPasswordForm = () => {
  const [isDone, setIsDone] = React.useState(false);
  const { key } = useParams({ strict: false });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["auth", "resetPassword", "key"],
    retry: false,
    gcTime: 0,
    queryFn: async () => {
      try {
        await getPasswordReset(key);
        return { keyValid: true };
      } catch (error) {
        // @ts-ignore
        if (error?.response?.status === 400) {
          return { keyValid: false };
        }
        throw error;
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return resetPassword({
        key,
        ...data,
      });
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  });
  const { control, handleSubmit } = formMethods;

  const onSubmit = (values: ValidationSchema) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div>
          <Spinner />
        </div>
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <Alert color="warning">An error occurred. Please try again.</Alert>
      </Wrapper>
    );
  }

  if (data && data.keyValid === false) {
    return (
      <Wrapper>
        <Alert color="warning">
          The password reset link was invalid, possibly because it has already
          been used.
          <br />
          <Link to="/password/reset/">Please request a new password reset</Link>
          .
        </Alert>
      </Wrapper>
    );
  }

  if (isDone) {
    return (
      <>
        <h1 className="text-cyan-700 text-lg text-md font-bold md:text-2xl">
          Reset you password
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
        Reset you password
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
          label="New password"
          name="password"
          placeholder="New password"
          type="password"
          size="md"
        />
        <div className="-mt-4">
          <TextInputField
            control={control}
            label="Repeat new password"
            name="repeat_password"
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
          Reset password
        </Button>
      </form>
    </>
  );
};
