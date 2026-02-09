import { useState, FormEvent } from "react";
import { Account, ExpenseCategory } from "@/shared/types";
import { RiCloseLine } from "@remixicon/react";
import Button from "./Button";

interface TransferModalProps {
  account: Account;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransferModal({
  account,
  onClose,
  onSuccess,
}: TransferModalProps) {
  const [accountDestNo, setAccountDestNo] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "">(
    ExpenseCategory.OTHER,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateAccountNumber = (accNo: string): boolean => {
    const regex = /^\d{3}-\d{13}-\d{2}$/;
    return regex.test(accNo);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAccountNumber(accountDestNo)) {
      setError("Neispravan format broja računa (npr. 160-0000012345678-91)");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Iznos mora biti veći od 0");
      return;
    }

    if (parseFloat(amount) > account.balance) {
      setError("Nemate dovoljno sredstava na računu");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          accountSrcNo: account.accountNo,
          accountDestNo,
          amount: parseFloat(amount),
          description: description || null,
          category: category || null,
          currencyID: account.currency.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Greška pri izvršavanju transakcije");
      }
    } catch (err) {
      setError("Greška pri slanju zahteva");
    } finally {
      setIsLoading(false);
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

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo plaćanje</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sa računa
            </label>
            <input
              type="text"
              value={account.accountNo}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Na račun *
            </label>
            <input
              type="text"
              value={accountDestNo}
              onChange={(e) => setAccountDestNo(e.target.value)}
              placeholder="160-0000012345678-91"
              required
              className="w-full px-4 py-3 border border-gray-300 placeholder-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iznos ({account.currency.code}) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Raspoloživo:{" "}
              {account.balance.toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
              })}{" "}
              {account.currency.code}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorija
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ExpenseCategory | "")
              }
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            >
              <option value="">Bez kategorije</option>
              <option value={ExpenseCategory.HOUSING}>
                {ExpenseCategory.HOUSING}
              </option>
              <option value={ExpenseCategory.HOME}>
                {ExpenseCategory.HOME}
              </option>
              <option value={ExpenseCategory.FOOD}>
                {ExpenseCategory.FOOD}
              </option>
              <option value={ExpenseCategory.SPORTS}>
                {ExpenseCategory.SPORTS}
              </option>
              <option value={ExpenseCategory.LEISURE}>
                {ExpenseCategory.LEISURE}
              </option>
              <option value={ExpenseCategory.GOING_OUT}>
                {ExpenseCategory.GOING_OUT}
              </option>
              <option value={ExpenseCategory.OTHER}>
                {ExpenseCategory.OTHER}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis plaćanja
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opis transakcije..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300  placeholder-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Otkaži
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Slanje..." : "Izvrši plaćanje"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
