"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthenticationContext";
import { accountService } from "@/services/api";
import { Account } from "@/shared/types";
import AccountCard from "@/components/AccountCard";
import Navigation from "@/components/Navigation";
import {
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
} from "@remixicon/react";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (user) {
        const res = await accountService.getAccountsByClientId();
        const data = await res.json()
        if (data.success){
          setAccounts(data.accounts);
          setIsLoading(false);
        }
      }
    };

    fetchAccounts();
  }, [user]);

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

  if (!user) {
    return null;
  }

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.currency.code === "RSD") {
      return sum + acc.balance;
    }
    return sum;
  }, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dobrodošli, {user.firstName}!
          </h1>
          <p className="text-gray-600">Pregled vaših računa i aktivnosti</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-8 text-black shadow-lg">
            <p className="text-black/70 text-sm font-medium mb-2">
              Ukupno stanje (RSD)
            </p>
            <p className="text-5xl font-bold mb-6">
              {totalBalance.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              RSD
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-black/80">
                  {accounts.length} aktivnih računa
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <RiUserLine className="w-5 h-5 text-yellow-600" />
              Osnovni podaci
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <RiMailLine className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RiPhoneLine className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Telefon</p>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RiCalendarLine className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs">Datum rođenja</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(user.dateOfBirth)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vaši računi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
