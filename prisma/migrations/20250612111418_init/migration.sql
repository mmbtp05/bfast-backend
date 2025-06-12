/*
  Warnings:

  - A unique constraint covering the columns `[user_id,permission_id]` on the table `UserPermissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Couriers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `JWTBlacklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `OrganizationRemittance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserPermissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('BUSINESS', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "Couriers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JWTBlacklist" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "business_gstin" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "individual_aadhar" TEXT,
ADD COLUMN     "individual_pan" TEXT,
ADD COLUMN     "pickup_address" TEXT,
ADD COLUMN     "pickup_city" TEXT,
ADD COLUMN     "pickup_landmark" TEXT,
ADD COLUMN     "pickup_pincode" TEXT,
ADD COLUMN     "pickup_state" TEXT,
ADD COLUMN     "return_address" TEXT,
ADD COLUMN     "return_city" TEXT,
ADD COLUMN     "return_landmark" TEXT,
ADD COLUMN     "return_pincode" TEXT,
ADD COLUMN     "return_state" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationRemittance" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Permissions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_type" "UserType" NOT NULL;

-- AlterTable
ALTER TABLE "UserPermissions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissions_user_id_permission_id_key" ON "UserPermissions"("user_id", "permission_id");
