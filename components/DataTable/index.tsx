"use client";
import { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
type DataTableProps = {
  headers: string[];
  rows: (string | JSX.Element)[][];
  caption?: string;
  sortable?: boolean;
  pagination?: boolean;
};

type SortDirection = "asc" | "desc";

const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  caption = "",
  sortable = false,
  pagination = false,
}) => {
  const [sortedColumn, setSortedColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleHeaderClick = (index: number) => {
    if (sortable) {
      if (index === sortedColumn) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortedColumn(index);
        setSortDirection("asc");
      }
    }
  };

  const sortRows = () => {
    if (sortedColumn !== null) {
      const sortedRows = [...rows];
      sortedRows.sort((a, b) => {
        const aValue = a[sortedColumn];
        const bValue = b[sortedColumn];

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (aValue.toLowerCase() < bValue.toLowerCase())
            return sortDirection === "asc" ? -1 : 1;
          if (aValue.toLowerCase() > bValue.toLowerCase())
            return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });

      return sortedRows;
    }

    return rows;
  };

  const paginatedRows = () => {
    if (pagination) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return sortRows().slice(startIndex, endIndex);
    }

    return sortRows();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4">
      <Table variant="simple">
        {caption && (
          <Box as="caption" mb="4" textAlign={"left"} fontWeight={"bold"}>
            {caption}
          </Box>
        )}
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th
                key={index}
                cursor={sortable ? "pointer" : "default"}
                onClick={() => handleHeaderClick(index)}
              >
                {header}
                {sortable && sortedColumn === index && (
                  <Box as="span" ml="2" fontSize="sm">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </Box>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedRows().map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataTable;
