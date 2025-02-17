"use server";

import { prisma } from "@/shared/prisma/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const createOrganization = async (
  userId: string | null,
  name: string,
  xin: string
) => {
  const clerk = await clerkClient();
  if (!userId) {
    throw new Error("Не удалось зарегистрироваться");
  }

  try {
    const organization = await prisma.organization.create({
      data: { name, xin },
    });

    await clerk.users.updateUserMetadata(userId, {
      privateMetadata: {
        organizationId: organization.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Не удалось привязать организацию");
  }
};
