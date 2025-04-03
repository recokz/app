"use server";

import { prisma } from "@/shared/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ReportStatus } from "@prisma/client";

export const createReport = async (): Promise<{ id: string }> => {
  console.log("Called action: createReport");
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Ошибка с авторизацией, попробуйте перезайти в систему");
    }

    const report = await prisma.report.create({
      data: {
        startDate: new Date(),
        endDate: new Date(),
        cashBalance: 0,
        status: ReportStatus.import_info,
        organization: {
          connect: {
            id: user.privateMetadata.organizationId as string,
          },
        },
      },
    });

    return { id: report.id };
  } catch (err) {
    console.error("Create report action error: ", err);
    throw err;
  }
};

export const getReport = async (id: string) => {
  console.log("Called action: getReport");
  try {
    const report = await prisma.report.findFirst({
      where: { id },
      include: {
        documents: {
          include: {
            transactions: {
              include: {
                bankReconciliations: true,
                crmReconciliations: true,
              },
            },
          },
        },
        reconciliations: {
          include: {
            bankTransaction: true,
            crmTransaction: true,
            type: true,
          },
        },
      },
    });

    if (!report) {
      throw new Error(`Отчет ${id} не найден`);
    }

    return report;
  } catch (err) {
    console.error("Get report action error: ", err);
    throw err;
  }
};

export const updateReportDate = async (data: {
  id: string;
  date: Date;
  status: ReportStatus;
}): Promise<{ id: string }> => {
  console.log("Called action: updateReportDate");
  try {
    const report = await prisma.report.update({
      where: { id: data.id },
      data: {
        startDate: data.date,
        endDate: data.date,
        status: data.status,
      },
    });

    return { id: report.id };
  } catch (err) {
    console.error("Update report date action error: ", err);
    throw err;
  }
};

export const updateReportCash = async (data: {
  id: string;
  cashBalance: number;
  status: ReportStatus;
}): Promise<{ id: string }> => {
  console.log("Called action: updateReportCash");
  try {
    const report = await prisma.report.update({
      where: { id: data.id },
      data: {
        cashBalance: data.cashBalance,
        status: data.status,
      },
    });

    return { id: report.id };
  } catch (err) {
    console.error("Update report cash action error: ", err);
    throw err;
  }
};

export const updateReportStatus = async (data: {
  id: string;
  status: ReportStatus;
}): Promise<{ id: string }> => {
  console.log("Called action: updateReportStatus");
  try {
    const report = await prisma.report.update({
      where: { id: data.id },
      data: {
        status: data.status,
      },
    });

    return { id: report.id };
  } catch (err) {
    console.error("Update report status action error: ", err);
    throw err;
  }
};
export const deleteReport = async (id: string): Promise<{ id: string }> => {
  console.log("Called action: deleteReport");
  try {
    const report = await prisma.report.delete({
      where: { id },
    });

    return { id: report.id };
  } catch (err) {
    console.error("Delete report action error: ", err);
    throw err;
  }
};
