CREATE TYPE "public"."account_status" AS ENUM('Aktivan', 'Neaktivan', 'Blokiran');--> statement-breakpoint
CREATE TYPE "public"."expense_category" AS ENUM('Stanovanje', 'Domaćinstvo', 'Hrana', 'Sport', 'Zabava', 'Izlazak', 'Ostalo');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('Muški', 'Ženski');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('Na čekanju', 'Izvršena', 'Neuspešna');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'MANAGER', 'CLIENT');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_no" varchar(50) NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "account_status" DEFAULT 'Aktivan' NOT NULL,
	"client_id" uuid NOT NULL,
	"currency_id" uuid NOT NULL,
	CONSTRAINT "accounts_account_no_unique" UNIQUE("account_no")
);
--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(3) NOT NULL,
	"name" varchar(100) NOT NULL,
	"symbol" varchar(10) NOT NULL,
	CONSTRAINT "currencies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "manager_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manager_id" uuid NOT NULL,
	"client_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"account_src_no" varchar(50) NOT NULL,
	"account_dest_no" varchar(50) NOT NULL,
	"description" text,
	"status" "transaction_status" DEFAULT 'Na čekanju' NOT NULL,
	"category" "expense_category",
	"currency_id" uuid NOT NULL,
	"account_src_id" uuid,
	"account_dest_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "user_role" NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"national_id" varchar(50) NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"sex" "sex" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_national_id_unique" UNIQUE("national_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_clients" ADD CONSTRAINT "manager_clients_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_clients" ADD CONSTRAINT "manager_clients_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_src_id_accounts_id_fk" FOREIGN KEY ("account_src_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_dest_id_accounts_id_fk" FOREIGN KEY ("account_dest_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;