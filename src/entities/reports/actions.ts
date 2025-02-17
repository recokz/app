"use server";

import { prisma } from "@/shared/prisma/prisma";
import { ReportStatus } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

export const createReport = async (): Promise<{ id: string }> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Ошибка с авторизацией, попробуйте перезайти в систему");
  }

  const report = await prisma.report.create({
    data: {
      date: new Date(),
      cashBalance: 0,
      status: ReportStatus.IN_PROGRESS,
      organization: {
        connect: {
          id: user.privateMetadata.organizationId as string,
        },
      },
    },
  });

  return { id: report.id };
};
