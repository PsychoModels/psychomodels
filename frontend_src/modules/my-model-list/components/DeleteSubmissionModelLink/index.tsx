import { Modal } from "flowbite-react";
import React, { useState } from "react";
import NewWindowIcon from "../../../shared/components/Icons/NewWindowIcon.tsx";

export const DeleteSubmissionModelLink = () => {
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);

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
              This is a submitted and/or published model. You cannot delete this
              item directly.
              <br /> To request deletion, please use our{" "}
              <a
                target="_blank"
                href="/contact/"
                className="inline-flex items-center text-tertiary hover:underlin ml-2"
              >
                contact form <NewWindowIcon />
              </a>
              .
            </h3>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
