-- AlterTable
ALTER TABLE `club` ADD COLUMN `photoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `notificationPreferences` VARCHAR(191) NULL DEFAULT 'email_push',
    ADD COLUMN `skills` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
