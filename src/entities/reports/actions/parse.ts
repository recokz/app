"use server";

import * as XLSX from "xlsx";
import {
  areSameDate,
  parseDateTime,
} from "@/entities/reports/utils/parse-date-time";
import { DataObject } from "@/entities/reports/types";

type ParsedData = {
  data: DataObject[];
};

type FileParams = {
  sheetNumber: number;
  rowNumber: number | number[];
  dateField: string;
  timeField?: string;
  amountField: string;
};

export const parseXLSX = async (
  file: File,
  date: Date,
  params: FileParams,
): Promise<ParsedData> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[params.sheetNumber];
  const worksheet = workbook.Sheets[sheetName];

  const headerRow = detectHeaderRow(
    worksheet,
    [params.dateField, params.amountField],
    typeof params.rowNumber === "number"
      ? params.rowNumber - 1
      : params.rowNumber[0],
    typeof params.rowNumber === "number"
      ? params.rowNumber
      : params.rowNumber[1],
  );

  const jsonData: DataObject[] = XLSX.utils.sheet_to_json(worksheet, {
    range: headerRow,
  });

  const data: DataObject[] = jsonData?.reduce<DataObject[]>((acc, row) => {
    const rowDate = row[params.dateField];
    if (!rowDate) return acc;

    const parsedDate = parseDateTime(
      row[params.dateField],
      params.timeField ? row[params.timeField]?.toString() : undefined,
    );
    const amount = parseAmount(row[params.amountField]);

    if (areSameDate(parsedDate, date) && !isNaN(amount)) {
      acc.push({
        ...row,
        [params.dateField]: parsedDate.format("YYYY-MM-DD HH:mm"),
      });
    }

    return acc;
  }, []);

  return {
    data,
  };
};

const parseAmount = (amount: string | number): number => {
  if (typeof amount === "string") {
    return parseFloat(amount.replace(",", "."));
  }
  return amount;
};

function detectHeaderRow(
  worksheet: XLSX.WorkSheet,
  headerIdentifiers: string[],
  start: number,
  end: number,
) {
  if (!worksheet["!ref"]) return 0;

  console.log(headerIdentifiers, start, end);

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let rowIndex = start; rowIndex <= end; rowIndex++) {
    let potentialHeadersFound = 0;

    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      const cell = worksheet[cellAddress];

      if (cell && cell.v) {
        if (
          headerIdentifiers.some(
            (identifier) =>
              String(cell.v).trim().toLowerCase() === identifier.toLowerCase(),
          )
        ) {
          potentialHeadersFound++;
        }
      }
    }

    if (potentialHeadersFound >= 2) {
      return rowIndex;
    }
  }

  return 1;
}
