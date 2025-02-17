"use server";

import { prisma } from "@/shared/prisma/prisma";
import { Report } from "@prisma/client";

export const getReport = async (id: string): Promise<Report> => {
  const report = await prisma.report.findFirst({
    where: { id },
  });

  if (!report) {
    throw new Error(`Отчет не найден: ${id}`);
  }

  return report;
};
