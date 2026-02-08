ALTER TABLE "accounts" DROP CONSTRAINT "accounts_client_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;