const FALLBACK_RATES = { EUR: 0.92, GBP: 0.79 };
const TTL_MS = 60 * 60 * 1000;

export type UsdRates = { EUR: number; GBP: number };

let cached: { rates: UsdRates; ts: number } | null = null;

export async function getUsdRates(): Promise<UsdRates> {
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.rates;

  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const { EUR, GBP } = data?.rates ?? {};
    if (typeof EUR === "number" && typeof GBP === "number") {
      cached = { rates: { EUR, GBP }, ts: Date.now() };
      return cached.rates;
    }
  } catch {
    // ponytail: network hiccup, fall back to last known/hardcoded rates
  }
  return cached?.rates ?? FALLBACK_RATES;
}

export function formatUsdAmount(amount: number, rates: UsdRates): string {
  return `$${amount.toFixed(2)} / €${(amount * rates.EUR).toFixed(2)} / £${(amount * rates.GBP).toFixed(2)}`;
}
