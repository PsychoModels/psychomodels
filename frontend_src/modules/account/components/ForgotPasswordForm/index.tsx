import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { TurnstileWidget } from "../../../shared/components/Form/TurnstileWidget.tsx";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Alert, Button } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "../../lib/allauth.ts";

const formSchema = z.object({
  email: z.string().email(),
  cf_turnstile_response: z
    .string()
    .min(1, { message: "Please complete the anti-spam check" }),
});

type ValidationSchema = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const [isDone, setIsDone] = React.useState(false);

  const [turnstileToken, setTurnstileToken] = React.useState("");
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return requestPasswordReset(data);
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
    onError: () => {
      turnstileRef.current?.reset();
      formMethods.setValue("cf_turnstile_response", "");
      setTurnstileToken("");
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      cf_turnstile_response: "",
    },
  });

  if (isDone) {
    return (
      <Alert color="success" className="text-md">
        A password reset link should have been sent to your inbox, if an account
        existed with the email you provided.
      </Alert>
    );
  }

  const { control, handleSubmit, setValue } = formMethods;

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

        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={(token) => {
            setValue("cf_turnstile_response", token, { shouldValidate: true });
            setTurnstileToken(token);
          }}
        />
        <Button
          className="flex-1"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending || !turnstileToken}
          isProcessing={mutation.isPending}
        >
          Request password reset
        </Button>
      </form>
    </>
  );
};
