/*
  Warnings:

  - A unique constraint covering the columns `[addedBy]` on the table `Programe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addedFor]` on the table `Programe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addedBy` to the `Programe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedFor` to the `Programe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Client_coachId_fkey` ON `client`;

-- DropIndex
DROP INDEX `Exercice_addedBy_fkey` ON `exercice`;

-- DropIndex
DROP INDEX `Exercice_categoryId_fkey` ON `exercice`;

-- DropIndex
DROP INDEX `ExercicePrograme_programmeId_fkey` ON `exerciceprograme`;

-- AlterTable
ALTER TABLE `programe` ADD COLUMN `addedBy` INTEGER NOT NULL,
    ADD COLUMN `addedFor` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Programe_addedBy_key` ON `Programe`(`addedBy`);

-- CreateIndex
CREATE UNIQUE INDEX `Programe_addedFor_key` ON `Programe`(`addedFor`);

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercice` ADD CONSTRAINT `Exercice_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercice` ADD CONSTRAINT `Exercice_addedBy_fkey` FOREIGN KEY (`addedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Programe` ADD CONSTRAINT `Programe_addedBy_fkey` FOREIGN KEY (`addedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Programe` ADD CONSTRAINT `Programe_addedFor_fkey` FOREIGN KEY (`addedFor`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExercicePrograme` ADD CONSTRAINT `ExercicePrograme_exerciceId_fkey` FOREIGN KEY (`exerciceId`) REFERENCES `Exercice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExercicePrograme` ADD CONSTRAINT `ExercicePrograme_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `Programe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
