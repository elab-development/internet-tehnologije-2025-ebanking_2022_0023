import { Client, Account, Transaction } from "@/shared/types";
import { mockClient, mockAccounts, mockTransactions } from "@/mock/data";

export const authService = {
  async login(email: string, password: string): Promise<Response> {
    return fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
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
  async getAccountsByClientId(): Promise<Response> {
    return fetch("/api/accounts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  },

  async getAccountById(id: string): Promise<Response> {
    return fetch(`/api/accounts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  },
};

export const transactionService = {
  async getTransactionsByAccountNo(accountNo: string): Promise<Response> {
    return fetch(`/api/transactions?accNo=${accountNo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  },

  async getTransactionById(id: string): Promise<Response> {
    return fetch(`/api/transactions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
  },
};

export const currencyService = {
  async getCurrencyById(id: string): Promise<Response> {
    return fetch(`/api/currencies/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
