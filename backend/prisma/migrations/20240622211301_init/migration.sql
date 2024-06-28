-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('HEADING', 'TEXT', 'LINK', 'CHECKBOX', 'IMAGE');

-- CreateEnum
CREATE TYPE "CustomPropertyType" AS ENUM ('STRING', 'NUMBER', 'SELECT', 'MULTISELECT', 'URL');

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" INTEGER,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" SERIAL NOT NULL,
    "type" "ContentType" NOT NULL,
    "data" JSONB NOT NULL,
    "pageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomProperty" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "CustomPropertyType" NOT NULL,
    "pageId" INTEGER,

    CONSTRAINT "CustomProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomPropertyOption" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "customPropertyId" INTEGER NOT NULL,

    CONSTRAINT "CustomPropertyOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPage" (
    "userId" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "UserPage_pkey" PRIMARY KEY ("userId","pageId")
);

-- CreateIndex
CREATE INDEX "idx_content_block_page" ON "ContentBlock"("pageId");

-- CreateIndex
CREATE INDEX "idx_custom_property_page" ON "CustomProperty"("pageId");

-- CreateIndex
CREATE INDEX "idx_custom_property_option" ON "CustomPropertyOption"("customPropertyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomProperty" ADD CONSTRAINT "CustomProperty_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPropertyOption" ADD CONSTRAINT "CustomPropertyOption_customPropertyId_fkey" FOREIGN KEY ("customPropertyId") REFERENCES "CustomProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPage" ADD CONSTRAINT "UserPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPage" ADD CONSTRAINT "UserPage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
