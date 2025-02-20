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

export const createTransaction = async ({
  bankDocumentId,
  crmDocumentId,
  transactions,
}: {
  bankDocumentId?: string;
  crmDocumentId?: string;
  transactions: Array<Transaction>;
}) => {
  const bankTransactions = await prisma.transaction.createMany({
    data: transactions.map((transaction) => ({
      amount: transaction.amount,
      date: transaction.date,
      bankDocumentId,
      crmDocumentId,
    })),
  });

  return { count: bankTransactions.count };
};
