"use server";

import { prisma } from "@/shared/prisma/prisma";
import { DocumentType } from "@prisma/client";

type CreateDocumentInput = {
  name: string;
  balance: number;
  link: string;
  type: DocumentType;
  reportId: string;
};

export const createDocument = async (data: CreateDocumentInput) => {
  const document = await prisma.document.create({
    data: {
      name: data.name,
      balance: data.balance,
      link: data.link,
      type: data.type,
      report: {
        connect: {
          id: data.reportId,
        },
      },
    },
  });

  return { id: document.id };
};

export const removeDocument = async (id: string) => {
  await prisma.document.delete({
    where: {
      id,
    },
  });
};
