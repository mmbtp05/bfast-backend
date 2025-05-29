-- CreateEnum
CREATE TYPE "BusinessCategories" AS ENUM ('SOLE', 'INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "BankAccountTypes" AS ENUM ('SAVING', 'CURRENT');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "company_name" TEXT,
    "brand_name" TEXT,
    "business_category" "BusinessCategories",
    "business_subcategory" TEXT,
    "company_logo" TEXT,
    "bank_account_number" TEXT,
    "bank_account_name" TEXT,
    "bank_name" TEXT,
    "bank_ifsc_code" TEXT,
    "bank_account_type" "BankAccountTypes",
    "billing_address" TEXT,
    "billing_address_landmark" TEXT,
    "billing_address_pincode" TEXT,
    "billing_address_city" TEXT,
    "billing_address_state" TEXT,
    "billing_address_contact_number" TEXT,
    "invoice_prefix" TEXT,
    "invoice_series_starting_from" TEXT,
    "invoice_cin_number" TEXT,
    "invoice_hide_buyer_contact" BOOLEAN NOT NULL DEFAULT true,
    "invoice_signature" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "role" "Roles" NOT NULL,
    "password" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "UserPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
