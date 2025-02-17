"use server";

import * as XLSX from "xlsx";
import dayjs from "dayjs";

type XlsxParserInput = {
  file: File;
  date: Date;
  sheetNumber: number;
  rowNumber: number;
  dateField: string;
  amountField: string;
};

export const parseXLSX = async ({
  file,
  sheetNumber,
  rowNumber,
  dateField,
  amountField,
  date,
}: XlsxParserInput) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[sheetNumber];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: rowNumber });

  const data = jsonData?.filter((row: unknown) => {
    const typedRow = row as Record<string, string | number>;

    const dateTime = typedRow[dateField];
    let rowDate;

    switch (typeof dateTime) {
      case "number":
        rowDate = excelDateToJSDate(dateTime);
        break;
      case "string":
        const stringDateTime = dateTime?.split(" ")?.[0];
        const [day, month, year] = stringDateTime
          ? stringDateTime.split(".")
          : ["", "", ""];
        rowDate = `${year}-${month}-${day}`;
        break;
      default:
        rowDate = dateTime;
    }

    const amountString = typedRow[amountField];

    const amount =
      typeof amountString === "string"
        ? parseFloat(amountString.replace(",", "."))
        : amountString;

    return (
      rowDate && rowDate === dayjs(date).format("YYYY-MM-DD") && !isNaN(amount)
    );
  });

  return {
    data: JSON.parse(JSON.stringify(data)),
  };
};

const excelDateToJSDate = (serial: number): string => {
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return date.toISOString().split("T")[0];
};
