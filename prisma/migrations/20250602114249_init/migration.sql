/*
  Warnings:

  - You are about to drop the column `bank_account_name` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `bank_account_number` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `bank_account_type` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `bank_ifsc_code` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "bank_account_name",
DROP COLUMN "bank_account_number",
DROP COLUMN "bank_account_type",
DROP COLUMN "bank_ifsc_code",
DROP COLUMN "bank_name",
ADD COLUMN     "compant_website" TEXT,
ADD COLUMN     "company_email" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "buyer_detail_access" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OrganizationRemittance" (
    "id" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_type" "BankAccountTypes" NOT NULL,
    "beneficiary_name" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "remittance_period" INTEGER NOT NULL DEFAULT 14,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "OrganizationRemittance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Couriers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationRemittance_org_id_key" ON "OrganizationRemittance"("org_id");

-- AddForeignKey
ALTER TABLE "OrganizationRemittance" ADD CONSTRAINT "OrganizationRemittance_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
