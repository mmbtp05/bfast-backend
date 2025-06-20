/*
  Warnings:

  - You are about to drop the column `compant_website` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "compant_website",
ADD COLUMN     "company_website" TEXT,
ADD COLUMN     "kyc_detail" JSONB;

-- CreateTable
CREATE TABLE "OrganizationCouriersPriority" (
    "id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "org_id" TEXT NOT NULL,
    "courier_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationCouriersPriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierBaseCharges" (
    "id" TEXT NOT NULL,
    "courier_id" TEXT NOT NULL,

    CONSTRAINT "CourierBaseCharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateCard" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationCouriersPriority" ADD CONSTRAINT "OrganizationCouriersPriority_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCouriersPriority" ADD CONSTRAINT "OrganizationCouriersPriority_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "Couriers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
