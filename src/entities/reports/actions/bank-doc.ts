"use server";

import { prisma } from "@/shared/prisma/prisma";
import { BankType } from "@prisma/client";

export const createBankDoc = async (
  name: string,
  balance: number,
  reportId: string,
  bankType: BankType
) => {
  const bankDoc = await prisma.bankDocument.create({
    data: {
      name,
      balance,
      type: bankType,
      report: {
        connect: {
          id: reportId,
        },
      },
    },
  });

  return { id: bankDoc.id };
};
