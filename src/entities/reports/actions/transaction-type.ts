"use server";

import { prisma } from "@/shared/prisma/prisma";
import { TransactionCategory } from "@prisma/client";

export const getTransactionTypes = async (category: TransactionCategory) => {
  return prisma.transactionType.findMany({
    where: {
      category,
    },
  });
};
