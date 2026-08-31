CREATE TABLE `test_findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`stepId` int,
	`severity` enum('info','warning','critical') NOT NULL,
	`title` varchar(180) NOT NULL,
	`expected` text NOT NULL,
	`actual` text NOT NULL,
	`recommendation` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`scenarioId` int NOT NULL,
	`status` enum('passed','failed','blocked') NOT NULL,
	`startedAt` timestamp NOT NULL,
	`finishedAt` timestamp NOT NULL,
	`totalSteps` int NOT NULL DEFAULT 0,
	`passedSteps` int NOT NULL DEFAULT 0,
	`failedSteps` int NOT NULL DEFAULT 0,
	`blockedSteps` int NOT NULL DEFAULT 0,
	`summary` text NOT NULL,
	CONSTRAINT `test_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `test_scenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scenarioId` int NOT NULL,
	`position` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`method` enum('GET','POST','PUT','PATCH','DELETE') NOT NULL DEFAULT 'POST',
	`path` varchar(255) NOT NULL,
	`expectedStatus` int NOT NULL,
	`requestBody` text,
	`assertion` text NOT NULL,
	CONSTRAINT `test_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `test_findings` ADD CONSTRAINT `test_findings_runId_test_runs_id_fk` FOREIGN KEY (`runId`) REFERENCES `test_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_findings` ADD CONSTRAINT `test_findings_stepId_test_steps_id_fk` FOREIGN KEY (`stepId`) REFERENCES `test_steps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_runs` ADD CONSTRAINT `test_runs_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_runs` ADD CONSTRAINT `test_runs_scenarioId_test_scenarios_id_fk` FOREIGN KEY (`scenarioId`) REFERENCES `test_scenarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_scenarios` ADD CONSTRAINT `test_scenarios_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `test_steps` ADD CONSTRAINT `test_steps_scenarioId_test_scenarios_id_fk` FOREIGN KEY (`scenarioId`) REFERENCES `test_scenarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `test_findings_run_idx` ON `test_findings` (`runId`);--> statement-breakpoint
CREATE INDEX `test_runs_owner_idx` ON `test_runs` (`ownerId`);--> statement-breakpoint
CREATE INDEX `test_runs_scenario_idx` ON `test_runs` (`scenarioId`);--> statement-breakpoint
CREATE INDEX `test_scenarios_owner_idx` ON `test_scenarios` (`ownerId`);--> statement-breakpoint
CREATE INDEX `test_steps_scenario_idx` ON `test_steps` (`scenarioId`);