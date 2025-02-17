-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('IMPORT', 'SALES', 'INCOME', 'EXPENSES', 'DONE');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('ADMISSION', 'EXPENSES');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "xin" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cash_balance" INTEGER NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'IMPORT',
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "report_id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_transactions" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "document_id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TransactionCategory" NOT NULL DEFAULT 'ADMISSION',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_documents" ADD CONSTRAINT "bank_documents_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_documents" ADD CONSTRAINT "bank_documents_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "bank_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "bank_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "transaction_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
