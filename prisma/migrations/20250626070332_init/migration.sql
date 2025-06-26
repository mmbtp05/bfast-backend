/*
  Warnings:

  - You are about to drop the `RateCard` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[org_id,courier_id,priority]` on the table `OrganizationCouriersPriority` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dead_weight` to the `CourierBaseCharges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `org_id` to the `CourierBaseCharges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CourierBaseCharges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volumetric_factor` to the `CourierBaseCharges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourierBaseCharges" ADD COLUMN     "cod_percentage" DOUBLE PRECISION,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dead_weight" INTEGER NOT NULL,
ADD COLUMN     "insurance_charge" INTEGER,
ADD COLUMN     "max_cod_charges" INTEGER,
ADD COLUMN     "min_cod_charges" INTEGER,
ADD COLUMN     "org_id" TEXT NOT NULL,
ADD COLUMN     "qc_charge" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "volumetric_factor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "is_pickup_rto_same" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "RateCard";

-- CreateTable
CREATE TABLE "CourierRateCard" (
    "id" TEXT NOT NULL,
    "courier_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "zone_code" TEXT NOT NULL,
    "transport_mode" TEXT NOT NULL,
    "shipment_type" TEXT NOT NULL,
    "base_rate" DOUBLE PRECISION NOT NULL,
    "base_kg" DOUBLE PRECISION NOT NULL,
    "add_x" DOUBLE PRECISION NOT NULL,
    "add_x_rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourierRateCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourierRateCard_courier_id_org_id_zone_code_transport_mode__idx" ON "CourierRateCard"("courier_id", "org_id", "zone_code", "transport_mode", "shipment_type");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCouriersPriority_org_id_courier_id_priority_key" ON "OrganizationCouriersPriority"("org_id", "courier_id", "priority");

-- AddForeignKey
ALTER TABLE "CourierBaseCharges" ADD CONSTRAINT "CourierBaseCharges_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "Couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierBaseCharges" ADD CONSTRAINT "CourierBaseCharges_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierRateCard" ADD CONSTRAINT "CourierRateCard_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "Couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierRateCard" ADD CONSTRAINT "CourierRateCard_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
