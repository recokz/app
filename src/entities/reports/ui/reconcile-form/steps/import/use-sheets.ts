import { useState } from "react";
import {
  Sheet,
  DataObject,
  ParserDocumentTypes,
  DEFAULT_FIELDS,
} from "@/entities/reports/types";
import { parseXLSX } from "@/entities/reports/actions/parse";

export function useSheets() {
  const [sheets, setSheets] = useState<Array<Sheet>>([]);

  const handleFileUpload = async (
    file: File | null,
    type: string | null,
    date: Date
  ) => {
    if (type && file) {
      const defaultFields = DEFAULT_FIELDS[type as ParserDocumentTypes];

      const response: { data: DataObject[] } = await parseXLSX({
        file,
        date,
        sheetNumber: defaultFields.sheetNumber,
        rowNumber: defaultFields.rowNumber,
        dateField: defaultFields.dateField,
        amountField: defaultFields.amountField,
      });

      setSheets((prevSheets) => [
        ...prevSheets,
        {
          filename: file.name,
          docType: type as ParserDocumentTypes,
          data: response.data,
        },
      ]);

      return true;
    }
    return false;
  };

  const handleRemoveSheet = (index: number) => {
    setSheets((prevSheets) => prevSheets.filter((_, i) => i !== index));
  };

  return {
    sheets,
    handleFileUpload,
    handleRemoveSheet,
    setSheets,
  };
}
