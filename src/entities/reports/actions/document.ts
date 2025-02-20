"use server";

import { prisma } from "@/shared/prisma/prisma";
import { BankType, CrmType } from "@prisma/client";
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

export const createCrmDoc = async (
  name: string,
  reportId: string,
  crmType: CrmType
) => {
  const crmDoc = await prisma.crmDocument.create({
    data: {
      name,
      type: crmType,
      report: {
        connect: {
          id: reportId,
        },
      },
    },
  });

  return { id: crmDoc.id };
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

export const reconcileTransactions = async ({
  crmDocumentId,
  bankDocumentId,
  transactions,
}: {
  crmDocumentId: string;
  bankDocumentId: string;
  transactions: Array<Transaction>;
}) => {
  let matchedCount = 0;

  await prisma.$transaction(async (tx) => {
    for (const transaction of transactions) {
      const startOfDay = new Date(transaction.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(transaction.date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log(transaction.amount, transaction.date);

      const matchingTransaction = await tx.transaction.findFirst({
        where: {
          amount: transaction.amount,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          crmDocumentId: null,
          bankDocumentId: bankDocumentId, // Added specific bankDocumentId
        },
      });

      if (matchingTransaction) {
        await tx.transaction.update({
          where: {
            id: matchingTransaction.id,
          },
          data: {
            crmDocumentId,
          },
        });
        matchedCount++;
      }
    }
  });

  return { matchedCount };
};
