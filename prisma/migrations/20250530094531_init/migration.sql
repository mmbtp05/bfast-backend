/*
  Warnings:

  - Added the required column `scope` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('GLOBAL', 'ORGANIZATION');

-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'OTHERS';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "parcels_per_month" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "scope" "RoleScope" NOT NULL;
