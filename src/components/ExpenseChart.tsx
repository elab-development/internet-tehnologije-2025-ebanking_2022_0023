import { Transaction, ExpenseCategory } from "@/shared/types";

interface ExpenseChartProps {
  transactions: Transaction[];
}

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenses = transactions.filter((tx) => tx.amount < 0 && tx.category);

  const categoryTotals = expenses.reduce(
    (acc, tx) => {
      if (tx.category) {
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      }
      return acc;
    },
    {} as Record<ExpenseCategory, number>,
  );

  const chartData = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Troškovi po kategoriji
        </h3>
        <p className="text-gray-500 text-center py-8">
          Nema podataka o troškovima
        </p>
      </div>
    );
  }

  const maxTotal = Math.max(...chartData.map((d) => d.total));

  const categoryColors: Record<string, string> = {
    [ExpenseCategory.HOUSING]: "#fbbf24",
    [ExpenseCategory.HOME]: "#60a5fa",
    [ExpenseCategory.FOOD]: "#34d399",
    [ExpenseCategory.SPORTS]: "#f472b6",
    [ExpenseCategory.LEISURE]: "#a78bfa",
    [ExpenseCategory.GOING_OUT]: "#fb923c",
    [ExpenseCategory.OTHER]: "#94a3b8",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Troškovi po kategoriji
      </h3>

      <div className="space-y-4">
        {chartData.map((item) => {
          const percentage = (item.total / maxTotal) * 100;

          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.category}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.total.toLocaleString("sr-RS", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: categoryColors[item.category] || "#94a3b8",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Ukupni troškovi
          </span>
          <span className="text-lg font-bold text-gray-900">
            {chartData
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString("sr-RS", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>
    </div>
  );
}
