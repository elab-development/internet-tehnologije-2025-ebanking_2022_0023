/**
 * Definitions of types used by the frontend
 */

// Enums
export enum Sex {
  MALE = "Muški",
  FEMALE = "Ženski",
}

export enum AccountStatus {
  ACTIVE = "Aktivan",
  INACTIVE = "Neaktivan",
  BLOCKED = "Blokiran",
}

export enum TransactionStatus {
  PENDING = "Na čekanju",
  EXECUTED = "Izvršena",
  FAILED = "Neuspešna",
}

export enum ExpenseCategory {
  HOUSING = "Stanovanje",
  HOME = "Domaćinstvo",
  FOOD = "Hrana",
  SPORTS = "Sport",
  LEISURE = "Zabava",
  GOING_OUT = "Izlazak",
  OTHER = "Ostalo",
}

// Types
export type UserRole = "ADMIN" | "MANAGER" | "CLIENT";

// Interfaces
export interface Currency {
  id: number;
  code: string; // 'USD'
  name: string; // 'American Dollar'
  symbol: string; // '$'
}

export interface BaseUser {
  id: number;
  role: UserRole;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
  dateOfBirth: Date;
  sex: Sex;
  createdAt: Date;
  active: boolean;
}

export interface Administrator extends BaseUser {
  role: "ADMIN";
}

export interface Manager extends BaseUser {
  role: "MANAGER";
  clientIDs: Array<number>;
}

export interface Client extends BaseUser {
  role: "CLIENT";
  managerID: number | null;
}

export interface Account {
  id: number;
  accountNo: string;
  balance: number;
  createdAt: Date;
  status: AccountStatus;
  clientID: number;
  currency: Currency;
  transactionIDs: Array<number>;
}

export interface Transaction {
  id: number;
  amount: number;
  timestamp: Date;
  accountSrcNo: string;
  accountDestNo: string;
  description: string | null;
  status: TransactionStatus;
  category: ExpenseCategory | null;
  currency: Currency;
}
