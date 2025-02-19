"use server";

import { prisma } from "@/shared/prisma/prisma";
import { BankType } from "@prisma/client";
import { Transaction } from "../types";

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

export const createBankTransaction = async (
  documentId: string,
  transactions: Array<Transaction>
) => {
  const bankTransactions = await prisma.bankTransaction.createMany({
    data: transactions.map((transaction) => ({
      amount: transaction.amount,
      date: transaction.date,
      documentId,
      typeId: "c7110171-7034-4855-b338-194c9fdf4953",
    })),
  });

  return { count: bankTransactions.count };
};
