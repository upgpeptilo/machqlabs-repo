"use client";

import { createContext, useContext, useState } from "react";
import type { Currency } from "./currency";

type CurrencyContextValue = {
  currency: Currency;
  hasChosen: boolean;
  chooseCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [hasChosen, setHasChosen] = useState(false);

  function chooseCurrency(c: Currency) {
    setCurrency(c);
    setHasChosen(true);
  }

  return (
    <CurrencyContext.Provider value={{ currency, hasChosen, chooseCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
