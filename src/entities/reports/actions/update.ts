"use server";

import { prisma } from "@/shared/prisma/prisma";
import { ReportStatus } from "@prisma/client";

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
