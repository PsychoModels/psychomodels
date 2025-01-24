import React from "react";
import { Table } from "flowbite-react";
import { DeleteDraftModelLink } from "../DeleteDraftModelLink";
import { DraftModel } from "../DataProvider";
import { localDateTimeFormat } from "../../../shared/util/localDateTimeFormat.ts";

interface Props {
  draftModels: DraftModel[];
}

export const MyDraftModelTable = ({ draftModels }: Props) => {
  if (!draftModels.length) {
    return (
      <div className="text-gray-500 bg-white md:rounded-md p-4">
        You have no draft models.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <Table.Head className="text-xs uppercase text-gray-700">
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Last updated</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {draftModels.map((item) => {
              const title = item.title || "Untitled #" + item.id;

              return (
                <Table.Row key={item.id} className="bg-white hover:bg-gray-50">
                  <Table.Cell className="whitespace-nowrap text-black text-base w-[70%]">
                    {title}
                  </Table.Cell>
                  <Table.Cell className="truncate">
                    {localDateTimeFormat(new Date(item.created_at))}
                  </Table.Cell>
                  <Table.Cell className="truncate">
                    {localDateTimeFormat(new Date(item.updated_at))}
                  </Table.Cell>
                  <Table.Cell className="flex space-x-4">
                    <button
                      className="font-medium text-tertiary hover:underline cursor-pointer truncate"
                      onClick={() =>
                        window.open(
                          `/models/submission/?draft_id=${item.id}`,
                          "_self",
                        )
                      }
                    >
                      Continue editing
                    </button>

                    <DeleteDraftModelLink id={item.id} title={title} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Cards for mobile screens */}
      <div className="md:hidden space-y-4">
        {draftModels.map((item) => {
          const title = item.title || "Untitled #" + item.id;
          return (
            <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black">{title}</h3>
              <p className="text-sm text-gray-600">
                Created: {localDateTimeFormat(new Date(item.created_at))}
              </p>
              <p className="text-sm text-gray-600">
                Updated: {localDateTimeFormat(new Date(item.updated_at))}
              </p>
              <div className="flex justify-between items-center mt-3">
                <button
                  className="text-tertiary font-medium hover:underline"
                  onClick={() =>
                    window.open(
                      `/models/submission/?draft_id=${item.id}`,
                      "_self",
                    )
                  }
                >
                  Continue editing
                </button>
                <DeleteDraftModelLink id={item.id} title={title} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
