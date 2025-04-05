-- AlterTable
ALTER TABLE "transaction_types" ADD COLUMN     "organization_id" TEXT;

-- AddForeignKey
ALTER TABLE "transaction_types" ADD CONSTRAINT "transaction_types_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
