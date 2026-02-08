This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Dusan: Ovo je prvi commit - test


********
DOCKER
*******
-Definisan .yml fajl. 
-Pokretanje preko docker compose up -d komande
-gasenje preko docker compose down -v



******************************
Database migrations (Drizzle)
******************************

This project uses Drizzle ORM + Drizzle Kit for database migrations.

The initial migration file
drizzle/0000_loose_human_fly.sql
creates all base tables, enums, and the __drizzle_migrations table.

Prerequisites

*Node.js installed

*Database running locally (Postgres)

*.env file set up with correct database connection string



1. Migracija 0000 kreira tabele
2. Migracija 0001 menja kolonu 'phone' u tabeli 'users'
3. Migracija 0002 dodaje 'middle_name' u 'users' - NULLABLE da ne bi pukla migracija
4. Migracija 0003 brise 'middle_name' 

Neka vas ne brine No config path provided, JER using default 'drizzle.config.ts'
POSTUPAK kreiranje migracija:
1.izmena u kodu
2.pokreartanje komande npx drizzle-kit generate
3.izvrsavanje migracije pokretanje komande npx drizzle-kit migrate

~~~~~~~~~~ npx drizzle-kit migrate ~~~~~~~~~~~~

This command will:

*read existing migration files from drizzle/

*apply them all

**********************
INFORMACIJE
**********************
.env
-.env mora imati svako zasebno jer je u gitignore
-sadrzaj - DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

********************
evo par komandi koje sam koristio za drizzle i postgres
***sa drizzle dokumentacije
-npm i drizzle-orm pg dotenv
-npm i -D drizzle-kit tsx @types/pg

***iz iskripte
-npm i bcrypt drizzle-orm jsonwebtoken pg tsx @remixicon/react
-npm i -D @types/bcrypt @types/jsonwebtoken @types/node @types/pg dotenv drizzle-kit






