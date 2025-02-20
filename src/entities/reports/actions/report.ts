"use server";

import { prisma } from "@/shared/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ReportStatus } from "@prisma/client";

export const createReport = async (): Promise<{ id: string }> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Ошибка с авторизацией, попробуйте перезайти в систему");
  }

  const report = await prisma.report.create({
    data: {
      date: new Date(),
      cashBalance: 0,
      status: ReportStatus.IMPORT,
      organization: {
        connect: {
          id: user.privateMetadata.organizationId as string,
        },
      },
    },
  });

  return { id: report.id };
};

export const getReport = async (id: string) => {
  const report = await prisma.report.findFirst({
    where: { id },
    include: {
      bankDocuments: {
        include: {
          transactions: {
            include: {
              type: true,
              crmDocument: true,
            },
          },
        },
      },
      crmDocuments: {
        include: {
          transactions: {
            include: { type: true, bankDocument: true },
          },
        },
      },
    },
  });

  if (!report) {
    throw new Error(`Отчет не найден: ${id}`);
  }

  return report;
};

export const updateReport = async (
  id: string,
  data: {
    date: Date;
    status: ReportStatus;
    cashBalance: number;
  }
): Promise<{ id: string }> => {
  const report = await prisma.report.update({
    where: { id },
    data: {
      date: data.date,
      cashBalance: data.cashBalance,
      status: data.status,
    },
  });

  return { id: report.id };
};
