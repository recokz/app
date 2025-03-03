"use server";

import { Transaction } from "@/entities/reports/types";
import { prisma } from "@/shared/prisma/prisma";

type CreateTransactionInput = {
  documentId: string;
  transactions: Array<Transaction>;
};

export const createTransactions = async ({
  documentId,
  transactions,
}: CreateTransactionInput) => {
  return prisma.transaction.createMany({
    data: transactions.map((transaction) => ({
      amount: transaction.amount,
      date: transaction.date,
      documentId,
    })),
  });
};
