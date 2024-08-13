import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { Alert, Button } from "flowbite-react";
import { SocialLoginButtons } from "../SocialLoginButtons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../lib/allauth.ts";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "The password must contain at least 8 characters" }),
});

type ValidationSchema = z.infer<typeof formSchema>;

interface Props {
  onLoginSuccess: (data: any) => void;
  socialAccountsNewWindow?: boolean;
  forgotPasswordLink: React.ReactNode;
}

export const LoginForm = ({
  onLoginSuccess,
  socialAccountsNewWindow = false,
  forgotPasswordLink,
}: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (loginData: ValidationSchema) => {
      return login(loginData);
    },
    onSuccess: (data) => {
      onLoginSuccess(data);

      // invalidate session status query
      queryClient.invalidateQueries({
        queryKey: ["auth", "session", "status"],
      });

      window.scrollTo(0, 0);
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { control, handleSubmit } = formMethods;

  const onSubmit = (values: ValidationSchema) => {
    mutation.mutate(values, { onSuccess: onLoginSuccess });
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
          <Alert color="failure" key={error.code} data-testid="error-message">
            <span className="font-medium">Error!</span> {error.message}
          </Alert>
        ))}
        <TextInputField
          control={control}
          label="Email"
          name="email"
          size="md"
          placeholder="Email address"
        />
        <div className="relative">
          <div className="absolute right-0 text-tertiary hover:underline text-sm mt-1">
            {forgotPasswordLink}
          </div>
          <TextInputField
            control={control}
            label="Password"
            name="password"
            placeholder="Password"
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
          Login
        </Button>
      </form>

      <div className="flex items-center w-full space-x-2 mt-4">
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
        <span className="text-sm text-gray-500 dark:text-gray-400">or </span>
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
      </div>

      <SocialLoginButtons
        action="LOGIN"
        socialAccountsNewWindow={socialAccountsNewWindow}
      />
    </>
  );
};
