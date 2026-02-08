import { Client, Account, Transaction } from "@/shared/types";
import { mockClient, mockAccounts, mockTransactions } from "@/mock/data";

export const authService = {
  async login(email: string, password: string): Promise<Client | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === mockClient.email && password === mockClient.password) {
      return mockClient;
    }
    return null;
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

export const clientService = {
  async getClientById(id: number): Promise<Client | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (id === mockClient.id) {
      return mockClient;
    }
    return null;
  },
};

export const accountService = {
  async getAccountsByClientId(clientId: number): Promise<Account[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockAccounts.filter((acc) => acc.clientID === clientId);
  },

  async getAccountById(id: number): Promise<Account | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const account = mockAccounts.find((acc) => acc.id === id);
    return account || null;
  },
};

export const transactionService = {
  async getTransactionsByAccountNo(accountNo: string): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockTransactions.filter(
      (tx) => tx.accountSrcNo === accountNo || tx.accountDestNo === accountNo,
    );
  },

  async getTransactionById(id: number): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const transaction = mockTransactions.find((tx) => tx.id === id);
    return transaction || null;
  },
};
