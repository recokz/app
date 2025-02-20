import { useState } from "react";
import {
  Sheet,
  DataObject,
  ParserDocumentTypes,
  DEFAULT_FIELDS,
  Transaction,
} from "@/entities/reports/types";
import { parseXLSX } from "@/entities/reports/actions/parse";

export function useSheets() {
  const [sheets, setSheets] = useState<Array<Sheet>>([]);

  const handleFileUpload = async (
    file: File | null,
    type: string | null,
    date: Date
  ): Promise<Sheet | null> => {
    if (type && file) {
      const defaultFields = DEFAULT_FIELDS[type as ParserDocumentTypes];

      const response: { data: DataObject[] } = await parseXLSX({
        file,
        date,
        sheetNumber: defaultFields.sheetNumber,
        rowNumber: defaultFields.rowNumber,
        dateField: defaultFields.dateField,
        timeField: defaultFields.timeField,
        amountField: defaultFields.amountField,
      });

      const newSheet: Sheet = {
        filename: file.name,
        docType: type as ParserDocumentTypes,
        data: response.data,
        transactions:
          (response.data.map((item) => {
            const amount = item[defaultFields.amountField];
            return {
              amount:
                typeof amount === "number"
                  ? amount
                  : Number(amount.replaceAll(",", ".")),
              date: new Date(item[defaultFields.dateField]),
            };
          }) as Transaction[]) || [],
      };

      setSheets((prevSheets) => [...prevSheets, newSheet]);

      return newSheet;
    }
    return null;
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
