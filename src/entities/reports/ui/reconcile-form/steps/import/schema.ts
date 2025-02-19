import { BankType } from "@prisma/client";
import { z } from "zod";

export const formSchema = z.object({
  date: z.date({ message: "Обязательное поле" }),
  cash_balance: z.number(),
  bank_balance: z.array(
    z.object({
      bank: z.nativeEnum(BankType),
      balance: z.number(),
    })
  ),
  bank_file_type: z.string().nullable(),
  bank_file: z.instanceof(File).nullable(),
  crm_file_type: z.string().nullable(),
  crm_file: z.instanceof(File).nullable(),
});

export type SchemaType = z.infer<typeof formSchema>;
