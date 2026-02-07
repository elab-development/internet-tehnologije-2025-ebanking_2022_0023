/**
 * Data used for testing without a DB
 */

import { Currency } from "@/shared/types";

export const currencies: Array<Currency> = [
  {
    id: 1,
    code: "RSD",
    name: "Srpski dinar",
    symbol: "RSD",
  },
  {
    id: 2,
    code: "EUR",
    name: "Evro",
    symbol: "€",
  },
  {
    id: 3,
    code: "GBP",
    name: "Britanska funta",
    symbol: "£",
  },
  {
    id: 4,
    code: "USD",
    name: "Američki dolar",
    symbol: "$",
  },
  {
    id: 5,
    code: "JPY",
    name: "Japanski jen",
    symbol: "¥",
  },
];
