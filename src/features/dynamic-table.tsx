import {
  ScrollArea,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import React from "react";

interface DataObject {
  [key: string]: string;
}

interface TableComponentProps {
  data: DataObject[];
}

export function DynamicTable({ data }: TableComponentProps) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <ScrollArea>
      <Table>
        <TableThead>
          <TableTr>
            {headers.map((header) => (
              <TableTh
                key={header}
                style={{ minWidth: "100px", whiteSpace: "nowrap" }}
              >
                {header}
              </TableTh>
            ))}
          </TableTr>
        </TableThead>
        <TableTbody>
          {data.map((row, index) => (
            <TableTr key={index}>
              {headers.map((header) => (
                <TableTd key={header} style={{ whiteSpace: "nowrap" }}>
                  {row[header] !== undefined ? row[header] : "-"}
                </TableTd>
              ))}
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </ScrollArea>
  );
}
