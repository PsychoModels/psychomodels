import React from "react";
import { Table } from "flowbite-react";
import { SubmittedModel } from "../DataProvider";
import { localDateTimeFormat } from "../../../shared/util/localDateTimeFormat.ts";
import { DeleteSubmissionModelLink } from "../DeleteSubmissionModelLink";

interface Props {
  submittedModels: SubmittedModel[];
}

export const MySubmissionModelTable = ({ submittedModels }: Props) => {
  if (!submittedModels.length) {
    return (
      <div className="text-gray-500 bg-white md:rounded-md p-4">
        You have no submissions.
      </div>
    );
  }

  return (
    <Table>
      <Table.Head className="text-xs uppercase text-gray-700">
        <Table.HeadCell>Title</Table.HeadCell>
        <Table.HeadCell>Submitted at</Table.HeadCell>
        <Table.HeadCell>Publication Status</Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {submittedModels.map((item) => {
          return (
            <Table.Row key={item.id} className="bg-white hover:bg-gray-50">
              <Table.Cell className="whitespace-nowrap text-black text-base w-[70%]">
                {item.title}
              </Table.Cell>
              <Table.Cell className="truncate">
                {localDateTimeFormat(new Date(item.created_at))}
              </Table.Cell>
              <Table.Cell className="truncate">
                in review/published post moderation/published
              </Table.Cell>
              <Table.Cell className="flex space-x-4">
                <button
                  className="font-medium text-tertiary hover:underline cursor-pointer"
                  onClick={() =>
                    window.open(`/models/submission/?id=${item.id}`, "_self")
                  }
                >
                  Edit
                </button>

                <DeleteSubmissionModelLink />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
