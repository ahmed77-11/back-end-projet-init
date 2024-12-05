/*
  Warnings:

  - Added the required column `image` to the `Exercice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Client_coachId_fkey` ON `client`;

-- DropIndex
DROP INDEX `Exercice_addedBy_fkey` ON `exercice`;

-- DropIndex
DROP INDEX `Exercice_categoryId_fkey` ON `exercice`;

-- AlterTable
ALTER TABLE `exercice` ADD COLUMN `image` VARCHAR(255) NOT NULL;

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
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;