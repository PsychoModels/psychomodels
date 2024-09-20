import React, { useEffect } from "react";
import { ThemeProvider } from "./modules/shared/components/ThemeProvider";
import { ContactForm } from "./modules/contact-form/components/ContactForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ContactFormApp = () => {
  const [loaded, setLoaded] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | undefined>();

  useEffect(() => {
    // Retrieve the initial data from the script tag
    const initialDataScript = document.getElementById("initial-data");

    let initialData: {
      userEmail?: string;
    } = { userEmail: undefined };

    try {
      if (initialDataScript?.textContent) {
        initialData = JSON.parse(initialDataScript.textContent);
      }
    } catch (error) {
      console.error("Error parsing initial data", error);
    } finally {
      setUserEmail(initialData.userEmail);
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ContactForm initialEmail={userEmail} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default ContactFormApp;
