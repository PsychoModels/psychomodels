import React from "react";
import { useHits } from "react-instantsearch";
import { Table } from "flowbite-react";

export const TableView = () => {
  const { items } = useHits();

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell className="bg-gray-200">Title</Table.HeadCell>
        <Table.HeadCell className="bg-gray-200">Frameworks</Table.HeadCell>
        <Table.HeadCell className="bg-gray-200">Disciplines</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {items.map((item) => (
          <Table.Row
            key={item.objectID}
            className="bg-white hover:bg-gray-50 hover:cursor-pointer"
            onClick={() => window.open(`/models/${item.slug}`, "_self")}
          >
            <Table.Cell className="whitespace-nowrap text-black text-base">
              {item.title}
            </Table.Cell>
            <Table.Cell>{item.framework_names.join(", ")}</Table.Cell>
            <Table.Cell>
              {item.psychology_discipline_names.join(", ")}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
