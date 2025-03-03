"use server";

import { prisma } from "@/shared/prisma/prisma";
import { bankTypes, crmTypes } from "@/features/report-form/utils";

export const reconcileReport = async (reportId: string) => {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
    include: {
      documents: {
        include: {
          transactions: true,
        },
      },
    },
  });

  if (!report) {
    throw new Error("Отчет не найден");
  }

  await prisma.reconciliation.deleteMany({
    where: {
      reportId: report.id,
    },
  });

  const bankDocuments = report.documents.filter((item) =>
    Object.keys(bankTypes).includes(item.type),
  );

  const crmDocuments = report.documents.filter((item) =>
    Object.keys(crmTypes).includes(item.type),
  );

  const bankTransactions = bankDocuments.flatMap((doc) => doc.transactions);

  const crmTransactions = crmDocuments.flatMap((doc) => doc.transactions);

  const reconciliations = [];

  for (const bankTransaction of bankTransactions) {
    const matchingCrmTransaction = crmTransactions.find(
      (crmTx) => crmTx.amount === bankTransaction.amount,
    );

    reconciliations.push({
      reportId: report.id,
      bankTransactionId: bankTransaction.id,
      crmTransactionId: matchingCrmTransaction?.id || null,
    });
  }

  // Add remaining unmatched CRM transactions
  const matchedCrmTransactionIds = reconciliations
    .filter((r) => r.crmTransactionId)
    .map((r) => r.crmTransactionId);

  const unmatchedCrmTransactions = crmTransactions.filter(
    (crmTx) => !matchedCrmTransactionIds.includes(crmTx.id),
  );

  for (const crmTransaction of unmatchedCrmTransactions) {
    reconciliations.push({
      reportId: report.id,
      bankTransactionId: null,
      crmTransactionId: crmTransaction.id,
    });
  }

  if (reconciliations.length > 0) {
    await prisma.reconciliation.createMany({
      data: reconciliations,
    });
  }
};

export const updateTransactionType = async (
  transactionId: string,
  typeId: string | null,
) => {
  await prisma.reconciliation.update({
    where: { id: transactionId },
    data: { typeId },
  });
};
