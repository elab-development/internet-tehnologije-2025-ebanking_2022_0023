"use client";

import { currencyService, exchangeRatesService } from "@/api";
import Navigation from "@/components/Navigation";
import { Currency } from "@/shared/types"; // assuming you have a Currency type
import { useEffect, useState } from "react";

export default function ExchangeRatesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await currencyService.getAllCurrencies();
        const data = await res.json();

        if (data.success) {
          setCurrencies(data.currencies);
          if (data.currencies.length >= 2) {
            setFromCurrency(data.currencies[0].code);
            setToCurrency(data.currencies[1].code);
          }
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
      }
    };

    fetchCurrencies();
  }, []);

  const handleGetRate = async () => {
    setLoading(true);
    try {
      const res = await exchangeRatesService.getExchangeRate(
        fromCurrency,
        toCurrency,
      );
      const data = await res.json();

      if (data.success) {
        setRate(data.rate);
      } else {
        setRate(null);
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Pretražite devizni kurs
        </h1>

        <div className="flex gap-4 mb-6">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border rounded px-3 py-2 text-gray-800"
          >
            {currencies.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="border rounded px-3 py-2 text-gray-800"
          >
            {currencies.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>

          <button
            onClick={handleGetRate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Nađi
          </button>
        </div>

        {loading && <p className="text-gray-700">Loading...</p>}

        {rate !== null && !loading && (
          <p className="text-lg font-semibold text-gray-900">
            1 {fromCurrency} = {rate} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}
