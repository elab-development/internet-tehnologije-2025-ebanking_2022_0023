import Link from "next/link";
import { Account, AccountStatus } from "@/shared/types";
import { RiArrowRightSLine } from "@remixicon/react";

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const formatBalance = (balance: number, symbol: string) => {
    return `${balance.toLocaleString("sr-RS", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${symbol}`;
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case AccountStatus.INACTIVE:
        return "bg-gray-100 text-gray-800";
      case AccountStatus.BLOCKED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/account/${account.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Broj računa</p>
            <p className="text-lg font-semibold text-gray-900">
              {account.accountNo}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}
          >
            {account.status}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Raspoloživo stanje</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatBalance(account.balance, account.currency.symbol)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Valuta</p>
            <p className="text-sm font-medium text-gray-700">
              {account.currency.code}
            </p>
          </div>
          <div className="flex items-center text-yellow-600 font-medium text-sm">
            Detalji
            <RiArrowRightSLine className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
