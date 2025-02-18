"use server";

import { prisma } from "@/shared/prisma/prisma";

export const createBankDoc = async (
  name: string,
  balance: number,
  reportId: string,
  bankTypeId: string
) => {
  const bankDoc = await prisma.bankDocument.create({
    data: {
      name,
      balance,
      report: {
        connect: {
          id: reportId,
        },
      },
      type: {
        connect: {
          id: bankTypeId,
        },
      },
    },
  });

  return { id: bankDoc.id };
};
