/*
  Warnings:

  - You are about to drop the `_exerciceprogrammes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Client_coachId_fkey` ON `client`;

-- DropIndex
DROP INDEX `Exercice_addedBy_fkey` ON `exercice`;

-- DropIndex
DROP INDEX `Exercice_categoryId_fkey` ON `exercice`;

-- DropTable
DROP TABLE `_exerciceprogrammes`;

-- CreateTable
CREATE TABLE `ExercicePrograme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exerciceId` INTEGER NOT NULL,
    `programmeId` INTEGER NOT NULL,
    `addedTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ExercicePrograme_exerciceId_programmeId_key`(`exerciceId`, `programmeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `ExercicePrograme` ADD CONSTRAINT `ExercicePrograme_exerciceId_fkey` FOREIGN KEY (`exerciceId`) REFERENCES `Exercice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExercicePrograme` ADD CONSTRAINT `ExercicePrograme_programmeId_fkey` FOREIGN KEY (`programmeId`) REFERENCES `Programe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRoles` ADD CONSTRAINT `_UserRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
