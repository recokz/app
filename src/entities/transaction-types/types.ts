import { TransactionCategory } from "@prisma/client";

export interface TransactionType {
  id: string;
  name: string;
  category: TransactionCategory;
  organizationId: string | null;
  createdAt: Date;
}
