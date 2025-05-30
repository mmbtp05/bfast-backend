-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "JWTBlacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "JWTBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JWTBlacklist_jti_key" ON "JWTBlacklist"("jti");

-- AddForeignKey
ALTER TABLE "JWTBlacklist" ADD CONSTRAINT "JWTBlacklist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
