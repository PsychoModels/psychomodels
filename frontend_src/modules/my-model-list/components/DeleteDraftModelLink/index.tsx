import { Alert, Button, Modal, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getCSRFToken } from "../../../account/lib/django.ts";

interface Props {
  id: number;
  title: string;
}

export const DeleteDraftModelLink = ({ id, title }: Props) => {
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/psychology_models/draft/${id}/`, {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    },
    onSuccess: () => {
      setConfirmIsOpen(false);
      window.location.reload();
    },
  });

  return (
    <>
      <button
        onClick={() => {
          setConfirmIsOpen(true);
          return;
        }}
        className="font-medium text-red-700 hover:underline cursor-pointer"
      >
        Delete
      </button>
      <Modal
        show={confirmIsOpen}
        size="md"
        onClose={() => setConfirmIsOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete the draft model with title{" "}
              <span className="text-black">{title}</span>
              ?
              <br />
              This cannot be undone.
            </h3>

            {mutation.isError && (
              <Alert color="failure" className="mb-6">
                A general error occurred. Please try again.
              </Alert>
            )}

            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate();
                }}
              >
                {mutation.isPending && (
                  <span className="pr-3">
                    <Spinner size="sm" />
                  </span>
                )}
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setConfirmIsOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
