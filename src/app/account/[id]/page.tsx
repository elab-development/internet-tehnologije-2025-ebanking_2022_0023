"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthenticationContext";
import {
  accountService,
  currencyService,
  transactionService,
} from "@/services/api";
import { Account, Transaction, TransactionStatus } from "@/shared/types";
import Navigation from "@/components/Navigation";
import ExpenseChart from "@/components/ExpenseChart";
import TransactionModal from "@/components/TransactionModal";
import Button from "@/components/Button";
import {
  RiArrowLeftLine,
  RiFilterLine,
  RiArrowDownLine,
  RiArrowUpLine,
} from "@remixicon/react";

export default function AccountDetailsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const accountId = params.id!.toString();

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">(
    "ALL",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      // Ucitavamo podatke o account-u
      const res = await accountService.getAccountById(accountId);
      const data = await res.json();
      if (data.success) {
        // Ucitavamo podatke o currency
        const currencyRes = await currencyService.getCurrencyById(
          data.account.currencyID,
        );
        const currencyData = await currencyRes.json();
        // Spajamo sa account
        const completeAccount = {
          ...data.account,
          currency: currencyData.success
            ? currencyData.currency
            : { symbol: "", code: "" },
        };
        setAccount(completeAccount);
        // Ucitavamo transactions
        const res1 = await transactionService.getTransactionsByAccountNo(
          data.account.accountNo,
        );
        const data1 = await res1.json();
        // Dobija se niz transakcija
        if (data1.success) {
          // Povezujemo transakciju sa valutom
          const enrichedTransactions = data1.transactions.map((tx: any) => ({
            ...tx,
            amount: Number(tx.amount),
            currency: account?.currency ||
              completeAccount.currency || { symbol: "RSD" },
          }));
          // Postavljamo useState promenljive sa PROSIRENIM podacima
          setTransactions(enrichedTransactions);
          setFilteredTransactions(enrichedTransactions);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [accountId]);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((tx) => tx.status === statusFilter),
      );
    }
  }, [statusFilter, transactions]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Učitavanje...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Račun nije pronađen</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, symbol: string) => {
    const formatted = Math.abs(amount).toLocaleString("sr-RS", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${amount < 0 ? "-" : "+"} ${formatted} ${symbol}`;
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.EXECUTED:
        return "bg-green-100 text-green-800";
      case TransactionStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TransactionStatus.FAILED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <RiArrowLeftLine className="w-5 h-5" />
          Nazad na pregled
        </Button>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-8 text-black shadow-lg mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-black/70 text-sm font-medium mb-1">
                Broj računa
              </p>
              <p className="text-2xl font-semibold mb-4">{account.accountNo}</p>
            </div>
            <span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium">
              {account.status}
            </span>
          </div>

          <div>
            <p className="text-black/70 text-sm font-medium mb-2">
              Raspoloživo stanje
            </p>
            <p className="text-5xl font-bold">
              {account.balance.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {account.currency.symbol}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ExpenseChart transactions={transactions} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Brzi pregled
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ukupno transakcija</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Primljeno</p>
                <p className="text-xl font-semibold text-green-600">
                  +
                  {transactions
                    .filter((tx) => tx.amount > 0)
                    .reduce((sum, tx) => sum + tx.amount, 0)
                    .toLocaleString("sr-RS", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Potrošeno</p>
                <p className="text-xl font-semibold text-red-600">
                  {transactions
                    .filter((tx) => tx.amount < 0)
                    .reduce((sum, tx) => sum + tx.amount, 0)
                    .toLocaleString("sr-RS", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Transakcije</h3>

            <div className="flex items-center gap-2">
              <RiFilterLine className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TransactionStatus | "ALL")
                }
                className="px-4 py-2 border text-gray-500  border-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              >
                <option value="ALL">Svi statusi</option>
                <option value={TransactionStatus.EXECUTED}>
                  {TransactionStatus.EXECUTED}
                </option>
                <option value={TransactionStatus.PENDING}>
                  {TransactionStatus.PENDING}
                </option>
                <option value={TransactionStatus.FAILED}>
                  {TransactionStatus.FAILED}
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nema transakcija za prikaz
              </p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount < 0 ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.amount < 0 ? (
                        <RiArrowDownLine className="w-5 h-5 text-red-600" />
                      ) : (
                        <RiArrowUpLine className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description || "Bez opisa"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.timestamp)}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.amount < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatAmount(
                        transaction.amount,
                        transaction.currency.symbol,
                      )}
                    </p>
                    {transaction.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.category}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
