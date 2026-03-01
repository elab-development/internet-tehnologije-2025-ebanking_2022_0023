import { ExpenseCategory } from "@/shared/types";

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

  async createTransaction(data: {
    accountSrcNo: string;
    accountDestNo: string;
    amount: number;
    description: string | null;
    category: ExpenseCategory | null;
    currencyID: string;
  }): Promise<Response> {
    return fetch(`/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    });
  },
};

export const currencyService = {
  async getCurrencyById(id: string): Promise<Response> {
    return fetch(`/api/currencies/${id}`, {
      method: "GET",
    });
  },
  async getAllCurrencies(): Promise<Response> {
    return fetch(`/api/currencies`, {
      method: "GET",
    });
  },
};

export const exchangeRatesService = {
  async getExchangeRate(
    currencyCodeFrom: string,
    currencyCodeTo: string,
  ): Promise<Response> {
    return fetch(
      `/api/exchange-rates?from=${currencyCodeFrom}&to=${currencyCodeTo}`,
      {
        method: "GET",
      },
    );
  },
};
