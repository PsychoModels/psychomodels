import React from "react";
import { TextInputField } from "../../../shared/components/Form/TextInputField.tsx";
import { TextAreaField } from "../../../shared/components/Form/TextAreaField.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, Button } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getCSRFToken } from "../../../account/lib/django.ts";

const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

type ValidationSchema = z.infer<typeof formSchema>;

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => (
  <div className="mx-auto mt-6 w-full">
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 min-w-96">
      <h2 className="text-cyan-700 text-xl font-bold md:text-2xl">
        Contact us
      </h2>
      {children}
    </div>
  </div>
);

interface Props {
  initialEmail?: string;
}

export const ContactForm = ({ initialEmail }: Props) => {
  const [isDone, setIsDone] = React.useState(false);

  const { control, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialEmail || "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return axios.post("/api/contact/  ", data, {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
  });

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

  if (isDone) {
    return (
      <Wrapper>
        <p className="text-gray-500 leading-7" data-testid="success-message">
          Thank you for you message. We will respond as soon as possible.
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <p className="text-gray-500 leading-7">
        Got a technical issue? Want to send feedback about this project? Or any
        other question? Let us know.
      </p>
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
          label="E-mail"
          name="email"
          required={true}
        />

        <TextInputField
          control={control}
          label="Subject"
          name="subject"
          required={true}
        />

        <TextAreaField
          control={control}
          label="Your message"
          name="message"
          required={true}
        />

        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          isProcessing={mutation.isPending}
          disabled={mutation.isPending}
          className="w-full md:max-w-md"
        >
          Send message
        </Button>
      </form>
    </Wrapper>
  );
};
