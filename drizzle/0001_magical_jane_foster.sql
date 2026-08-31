CREATE TABLE `test_assertions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`expression` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_assertions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `test_steps` ADD `assertionId` int;--> statement-breakpoint
ALTER TABLE `test_assertions` ADD CONSTRAINT `test_assertions_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `test_assertions_owner_idx` ON `test_assertions` (`ownerId`);--> statement-breakpoint
ALTER TABLE `test_steps` ADD CONSTRAINT `test_steps_assertionId_test_assertions_id_fk` FOREIGN KEY (`assertionId`) REFERENCES `test_assertions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `test_steps_assertion_idx` ON `test_steps` (`assertionId`);