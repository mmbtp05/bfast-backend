-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "is_kyc_done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pickup_lat" TEXT,
ADD COLUMN     "pickup_long" TEXT,
ADD COLUMN     "pickup_user_number" TEXT,
ADD COLUMN     "pickup_username" TEXT,
ADD COLUMN     "return_lat" TEXT,
ADD COLUMN     "return_long" TEXT,
ADD COLUMN     "return_user_number" TEXT,
ADD COLUMN     "return_username" TEXT,
ADD COLUMN     "verification_ref_id" TEXT;
