import { Alert, Button, Modal, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSaveAsDraft } from "../../hooks/useSaveAsDraft";

interface Props {
  asLink?: boolean;
  beforeSaveDraft: () => void;
}

export const SaveAsDraftButton = ({ asLink, beforeSaveDraft }: Props) => {
  const { save, isPending, isError, isSuccess } = useSaveAsDraft();

  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setIsSaved(true);

      const timer = setTimeout(() => {
        setIsSaved(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setErrorModalIsOpen(true);
    }
  }, [isError]);

  const performSave = () => {
    beforeSaveDraft();
    save();
  };

  return (
    <>
      <Button
        type="button"
        color="gray"
        className={
          asLink ? " border-transparent enabled:hover:bg-transparent" : ""
        }
        onClick={performSave}
        disabled={isPending || isSaved}
      >
        {isPending && (
          <span className="pr-3">
            <Spinner size="sm" />
          </span>
        )}
        {isSaved ? "Draft is saved" : "Save as draft"}
      </Button>
      <Modal
        show={errorModalIsOpen}
        size="md"
        onClose={() => setErrorModalIsOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <Alert color="failure" className="mb-6">
            An error occurred while saving the draft.
            <br />
            Please try again.
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
};
