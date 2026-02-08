import { Transaction, TransactionStatus } from "@/shared/types";
import { RiCloseLine, RiArrowRightLine } from "@remixicon/react";

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionModal({
  transaction,
  onClose,
}: TransactionModalProps) {
  if (!transaction) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("sr-RS", {
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RiCloseLine className="w-6 h-6 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Detalji transakcije
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Iznos</p>
            <p
              className={`text-3xl font-bold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {formatAmount(transaction.amount, transaction.currency.symbol)}
            </p>
          </div>

          <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Sa računa</p>
              <p className="text-sm font-medium text-gray-900 break-all">
                {transaction.accountSrcNo}
              </p>
            </div>
            <RiArrowRightLine className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Na račun</p>
              <p className="text-sm font-medium text-gray-900 break-all">
                {transaction.accountDestNo}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Kategorija</p>
              <p className="text-sm font-medium text-gray-900">
                {transaction.category || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Datum i vreme</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(transaction.timestamp)}
            </p>
          </div>

          {transaction.description && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Opis</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                {transaction.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-1">ID transakcije</p>
            <p className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded">
              {transaction.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
