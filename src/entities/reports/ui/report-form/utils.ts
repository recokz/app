import { useMemo } from "react";
import { DocumentType } from "@prisma/client";

export type BankDocumentType = Pick<
  Record<DocumentType, string>,
  "kaspi" | "kaspi_sales" | "halyk"
>;

export const bankTypes: BankDocumentType = {
  kaspi: "Каспи банк",
  kaspi_sales: "Каспи банк продажи",
  halyk: "Халық банк",
};

type CrmDocumentType = Pick<Record<DocumentType, string>, "moysklad">;

export const crmTypes: CrmDocumentType = {
  moysklad: "Мой склад",
};

interface BankBalance {
  bank: DocumentType;
  balance: number;
}

export const useDocumentTypeList = (data: BankBalance[]) => {
  const bankListToBalance = useMemo(
    () =>
      Object.entries(bankTypes)
        .map(([key, value]) => ({
          label: value,
          value: key,
        }))
        .filter((item) => !data.some((bank) => bank.bank === item.value)),
    [data],
  );
  const bankListToParse = useMemo(
    () =>
      Object.entries(bankTypes)
        .map(([key, value]) => ({
          label: value,
          value: key,
        }))
        .filter((item) => data.some((bank) => bank.bank === item.value)),
    [data],
  );

  const crmListToParse = Object.entries(crmTypes).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  return {
    bankListToBalance,
    bankListToParse,
    crmListToParse,
  };
};
