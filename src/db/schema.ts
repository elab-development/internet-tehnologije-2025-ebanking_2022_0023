import { pgTable, serial, varchar, text, timestamp, boolean, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Enums
 */
export const sexEnum = pgEnum('sex', ['Muški', 'Ženski']);
export const accountStatusEnum = pgEnum('account_status', ['Aktivan', 'Neaktivan', 'Blokiran']);
export const transactionStatusEnum = pgEnum('transaction_status', ['Na čekanju', 'Izvršena', 'Neuspešna']);
export const expenseCategoryEnum = pgEnum('expense_category', [
  'Stanovanje',
  'Domaćinstvo',
  'Hrana',
  'Sport',
  'Zabava',
  'Izlazak',
  'Ostalo',
]);
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'CLIENT']);

/**
 * Tables
 */

// Currency Table
export const currencies = pgTable('currencies', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 3 }).notNull().unique(), // 'USD'
  name: varchar('name', { length: 100 }).notNull(), // 'American Dollar'
  symbol: varchar('symbol', { length: 10 }).notNull(), // '$'
});

// Base Users Table (all users stored here)
export const users = pgTable('users', {                                        //izbaceno any
  id: serial('id').primaryKey(),
  role: userRoleEnum('role').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),                        //0002 migracija menja sa 20 na 30
  nationalId: varchar('national_id', { length: 50 }).notNull().unique(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  sex: sexEnum('sex').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),

  //middleName: varchar('middle_name', { length: 100 }),                 //dodato radi migracije 0002 - NULLABLE da ne bi pukla migracija       //zakomentarisano radi migracije 0003 - brisanje kolone iz tabele

});

// Manager-Client relationship table (for many-to-many if needed, or one-to-many tracking)
// This table tracks which managers are assigned to which clients
export const managerClients = pgTable('manager_clients', {
  id: serial('id').primaryKey(),
  managerID: integer('manager_id').notNull().references(() => users.id),
  clientID: integer('client_id').notNull().references(() => users.id),
  
});

// Account Table
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  accountNo: varchar('account_no', { length: 50 }).notNull().unique(),
  balance: numeric('balance', { precision: 15, scale: 2 }).notNull().default('0').$type<number>(),    //dodao decimal mapping jer se numeric pretvara u string a u types je dat kao numericki tip
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: accountStatusEnum('status').notNull().default('Aktivan'),
  clientID: integer('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),       //dodao cascade If a user is deleted Their accounts / relations should be cleaned up Otherwise Postgres will block deletes
  currencyID: integer('currency_id').notNull().references(() => currencies.id),
});

// Transaction Table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull().$type<number>(),                   //dodao decimal mapping jer se numeric pretvara u string a u types je dat kao numericki tip
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  accountSrcNo: varchar('account_src_no', { length: 50 }).notNull(),
  accountDestNo: varchar('account_dest_no', { length: 50 }).notNull(),
  description: text('description'),
  status: transactionStatusEnum('status').notNull().default('Na čekanju'),
  category: expenseCategoryEnum('category'),
  currencyID: integer('currency_id').notNull().references(() => currencies.id),
  
  // Foreign keys to actual account IDs (optional, for better relational integrity)
  accountSrcID: integer('account_src_id').references(() => accounts.id),
  accountDestID: integer('account_dest_id').references(() => accounts.id),
});

/**
 * Relations
 */

// Currency relations
export const currenciesRelations = relations(currencies, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
}));

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  // For managers - their assigned clients (through junction table)
  managedClients: many(managerClients, { relationName: 'manager' }),
  
  // For clients - their manager assignment (through junction table)
  managerAssignment: many(managerClients, { relationName: 'client' }),
  
  // Accounts owned by this user (for clients)
  accounts: many(accounts),
}));

// Manager-Client junction table relations
export const managerClientsRelations = relations(managerClients, ({ one }) => ({
  manager: one(users, {
    fields: [managerClients.managerID],
    references: [users.id],
    relationName: 'manager',
  }),
  client: one(users, {
    fields: [managerClients.clientID],
    references: [users.id],
    relationName: 'client',
  }),
}));

// Account relations
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  client: one(users, {
    fields: [accounts.clientID],
    references: [users.id],
  }),
  currency: one(currencies, {
    fields: [accounts.currencyID],
    references: [currencies.id],
  }),
  outgoingTransactions: many(transactions, { relationName: 'source' }),
  incomingTransactions: many(transactions, { relationName: 'destination' }),
}));

// Transaction relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  currency: one(currencies, {
    fields: [transactions.currencyID],
    references: [currencies.id],
  }),
  sourceAccount: one(accounts, {
    fields: [transactions.accountSrcID],
    references: [accounts.id],
    relationName: 'source',
  }),
  destinationAccount: one(accounts, {
    fields: [transactions.accountDestID],
    references: [accounts.id],
    relationName: 'destination',
  }),
}));

/**
 * Type exports 
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Currency = typeof currencies.$inferSelect;
export type NewCurrency = typeof currencies.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type ManagerClient = typeof managerClients.$inferSelect;
export type NewManagerClient = typeof managerClients.$inferInsert;