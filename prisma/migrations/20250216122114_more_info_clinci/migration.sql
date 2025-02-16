/*
  Warnings:

  - Added the required column `email` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "moreInfo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Clinic" ("address", "cnpj", "createdAt", "id", "name", "phone", "updatedAt") SELECT "address", "cnpj", "createdAt", "id", "name", "phone", "updatedAt" FROM "Clinic";
DROP TABLE "Clinic";
ALTER TABLE "new_Clinic" RENAME TO "Clinic";
CREATE UNIQUE INDEX "Clinic_cnpj_key" ON "Clinic"("cnpj");
CREATE UNIQUE INDEX "Clinic_email_key" ON "Clinic"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
