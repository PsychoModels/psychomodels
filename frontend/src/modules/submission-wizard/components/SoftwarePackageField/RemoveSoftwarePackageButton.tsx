import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Modal } from "flowbite-react";

interface Props {
  onRemove: () => void;
}

export const RemoveSoftwarePackageButton = ({ onRemove }: Props) => {
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);

  return (
    <>
      <Button
        size="xs"
        color="dark"
        className="opacity-70"
        onClick={() => {
          setConfirmIsOpen(true);
        }}
      >
        Remove <TrashIcon height={16} className="ml-2" />
      </Button>

      <Modal
        show={confirmIsOpen}
        size="md"
        onClose={() => setConfirmIsOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this software package?
              <br />
              This cannot be undone.
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  onRemove();
                  setConfirmIsOpen(false);
                }}
              >
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
