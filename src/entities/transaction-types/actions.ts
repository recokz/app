"use server";

import { prisma } from "@/shared/prisma/prisma";
import { TransactionCategory } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

export const getTransactionTypes = async (category?: TransactionCategory) => {
  const user = await currentUser();

  return prisma.transactionType.findMany({
    include: {
      organization: true,
    },
    where: {
      category,
      OR: [
        {
          organizationId: user?.privateMetadata.organizationId || null,
        },
        {
          organizationId: null,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createTransactionType = async ({
  name,
  category,
}: {
  name: string;
  category: TransactionCategory;
}) => {
  const user = await currentUser();

  return prisma.transactionType.create({
    data: {
      name,
      category,
      organizationId: user?.privateMetadata.organizationId as string,
    },
  });
};

export const deleteTransactionType = async (id: string) => {
  await prisma.transactionType.delete({
    where: {
      id,
    },
  });
};
