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
  rowNumber: number;
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
  const jsonData: DataObject[] = XLSX.utils.sheet_to_json(worksheet, {
    range: params.rowNumber,
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
