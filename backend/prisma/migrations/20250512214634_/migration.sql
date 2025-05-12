-- CreateTable
CREATE TABLE "filesystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_directory" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "data" BYTEA,

    CONSTRAINT "filesystem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filesystem_path_key" ON "filesystem"("path");
