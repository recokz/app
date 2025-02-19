import { useMemo } from "react";
import { BankType } from "@prisma/client";

export const bankTypes: Record<BankType, string> = {
  KASPI: "Каспи банк",
  HALYK: "Халық банк",
};

export const crmTypes: Record<string, string> = {
  moysklad: "Мой склад",
};

interface BankBalance {
  bank: BankType;
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
    [data]
  );
  const bankListToParse = useMemo(
    () =>
      Object.entries(bankTypes)
        .map(([key, value]) => ({
          label: value,
          value: key,
        }))
        .filter((item) => data.some((bank) => bank.bank === item.value)),
    [data]
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
