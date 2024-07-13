import React from "react";
import { useHits } from "react-instantsearch";
import { Table } from "flowbite-react";

export const TableView = () => {
  const { items } = useHits();

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Title</Table.HeadCell>
        <Table.HeadCell>Frameworks</Table.HeadCell>
        <Table.HeadCell>Disciplines</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {items.map((item) => (
          <Table.Row
            key={item.objectID}
            className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-secondary hover:text-white hover:cursor-pointer"
            onClick={() =>
              window.open(
                `https://staging.psychomodels.org/models/${item.slug}`,
                "_self",
              )
            }
          >
            <Table.Cell className="whitespace-nowrap font-medium dark:text-white">
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
