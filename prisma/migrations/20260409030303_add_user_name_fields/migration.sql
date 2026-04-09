-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "document" TEXT NOT NULL,
    "code" TEXT,
    "card_uuid" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_document_type" INTEGER NOT NULL,
    "id_role" INTEGER NOT NULL,
    "id_career" INTEGER,
    CONSTRAINT "users_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_id_career_fkey" FOREIGN KEY ("id_career") REFERENCES "careers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "users_id_document_type_fkey" FOREIGN KEY ("id_document_type") REFERENCES "document_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "card_uuid" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "id_user" INTEGER,
    "id_lab" INTEGER NOT NULL,
    "id_reason" INTEGER NOT NULL,
    CONSTRAINT "entries_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "entries_id_lab_fkey" FOREIGN KEY ("id_lab") REFERENCES "labs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "entries_id_reason_fkey" FOREIGN KEY ("id_reason") REFERENCES "reasons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "labs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "name" TEXT,
    "id_user" INTEGER,
    CONSTRAINT "labs_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "careers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_normalized" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "reasons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_card_uuid_key" ON "users"("card_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "labs_id_user_key" ON "labs"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "careers_name_key" ON "careers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_normalized_key" ON "document_types"("name_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "reasons_description_key" ON "reasons"("description");
