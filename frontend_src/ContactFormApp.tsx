import React from "react";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { ContactForm } from "./modules/contact-form/components/ContactForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ContactFormApp = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <ContactForm />
    </QueryClientProvider>
  </ThemeProvider>
);

export default ContactFormApp;
