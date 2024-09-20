import React from "react";
import { Button, Modal } from "flowbite-react";
import { FrameworkCard } from "./FrameworkCard.tsx";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import useStore from "../../store/useStore.ts";

interface Props {
  show: boolean;
  onClose: () => void;
  selectedFrameworkIds: (string | number)[];
  onSelect: (frameworkId: string | number) => void;
  onClickCreateNew: () => void;
}

export const FrameworkSelectModal = ({
  show,
  onClose,
  onSelect,
  selectedFrameworkIds,
  onClickCreateNew,
}: Props) => {
  const { frameworks } = useStore((state) => state);

  const filteredFrameworks = frameworks
    .filter((framework) => !framework?.isNew) // you cannot select newly created frameworks
    .filter((framework) => !selectedFrameworkIds.includes(framework.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Modal show={show} size="6xl" onClose={onClose} dismissible>
      <Modal.Header>Select a modeling framework</Modal.Header>
      <Modal.Body>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid="framework-select-list"
        >
          {filteredFrameworks.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              actionButton={
                <Button
                  size="xs"
                  onClick={() => {
                    onSelect(framework.id);
                    onClose();
                  }}
                >
                  Select <PlusCircleIcon height={18} className="ml-2" />
                </Button>
              }
            />
          ))}
        </div>

        {filteredFrameworks.length <= 0 && (
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  There are no modeling frameworks to select. You can add a new
                  framework by clicking the button below.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="whitespace-nowrap"
          onClick={onClickCreateNew}
          data-testid="create-new-framework-button"
        >
          Create new modeling framework
          <PlusIcon height="20" className="ml-3" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
