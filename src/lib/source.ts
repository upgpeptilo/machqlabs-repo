// Works out where a visitor came from (TikTok, Google, ChatGPT, ...) so each order
// can show its traffic source in the admin. Captured client-side on landing, stored
// in localStorage, and sent with the order at checkout.

export type VisitSource = {
  source: string; // human label, e.g. "TikTok", "Google", "ChatGPT"
  referrer: string; // raw document.referrer (may be "")
  landing: string; // landing path + query
};

const STORAGE_KEY = "mq_visit_source";

// host fragment -> label. Order matters: first match wins.
const HOST_RULES: [RegExp, string][] = [
  // AI assistants
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$|(^|\.)anthropic\.com$/, "Claude"],
  [/(^|\.)gemini\.google\.com$|(^|\.)bard\.google\.com$/, "Gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "Copilot"],
  [/(^|\.)deepseek\.com$/, "DeepSeek"],
  [/(^|\.)grok\.com$|(^|\.)x\.ai$/, "Grok"],
  [/(^|\.)you\.com$|(^|\.)phind\.com$|(^|\.)poe\.com$|(^|\.)meta\.ai$|(^|\.)mistral\.ai$/, "AI Assistant"],
  // social
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$|(^|\.)messenger\.com$/, "Facebook"],
  [/(^|\.)(x|twitter)\.com$|(^|\.)t\.co$/, "X / Twitter"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)pinterest\./, "Pinterest"],
  [/(^|\.)snapchat\.com$/, "Snapchat"],
  [/(^|\.)telegram\.(org|me)$|(^|\.)t\.me$/, "Telegram"],
  [/(^|\.)whatsapp\.(com|net)$/, "WhatsApp"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  // search
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)yandex\./, "Yandex"],
  [/(^|\.)brave\.com$/, "Brave Search"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
];

// utm_source value -> label (lowercased match on fragment)
const UTM_RULES: [RegExp, string][] = [
  [/chatgpt|openai/, "ChatGPT"],
  [/perplexity/, "Perplexity"],
  [/claude|anthropic/, "Claude"],
  [/gemini/, "Gemini"],
  [/copilot/, "Copilot"],
  [/tiktok|tt_ads/, "TikTok"],
  [/instagram|^ig$/, "Instagram"],
  [/facebook|^fb$|meta/, "Facebook"],
  [/twitter|^x$/, "X / Twitter"],
  [/reddit/, "Reddit"],
  [/youtube/, "YouTube"],
  [/telegram/, "Telegram"],
  [/whatsapp/, "WhatsApp"],
  [/google/, "Google"],
  [/bing/, "Bing"],
  [/email|newsletter|mail/, "Email"],
];

function labelFromHost(host: string): string | null {
  const h = host.toLowerCase().replace(/^www\./, "");
  for (const [re, label] of HOST_RULES) if (re.test(h)) return label;
  return null;
}

export function classifySource(referrer: string, search: string, ownHost: string): string {
  const params = new URLSearchParams(search);

  // explicit tracking params win
  const utm = (params.get("utm_source") || params.get("ref") || params.get("source") || "").toLowerCase();
  if (utm) {
    for (const [re, label] of UTM_RULES) if (re.test(utm)) return label;
    return utm.charAt(0).toUpperCase() + utm.slice(1);
  }
  if (params.has("ttclid")) return "TikTok";
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return "Google";
  if (params.has("fbclid")) return "Facebook";
  if (params.has("msclkid")) return "Bing";

  if (!referrer) return "Direct";
  let host = "";
  try {
    host = new URL(referrer).hostname;
  } catch {
    return "Direct";
  }
  if (host === ownHost) return "Direct";
  return labelFromHost(host) ?? host.replace(/^www\./, "");
}

const AI_LABELS = new Set(["ChatGPT", "Perplexity", "Claude", "Gemini", "Copilot", "DeepSeek", "Grok", "AI Assistant"]);

export function sourceCategory(source: string): "ai" | "tiktok" | "google" | "social" | "search" | "direct" | "other" {
  if (AI_LABELS.has(source)) return "ai";
  if (source === "TikTok") return "tiktok";
  if (source === "Google") return "google";
  if (["Instagram", "Facebook", "X / Twitter", "Reddit", "YouTube", "Pinterest", "Snapchat", "Telegram", "WhatsApp", "LinkedIn"].includes(source)) return "social";
  if (["Bing", "DuckDuckGo", "Yahoo", "Yandex", "Brave Search", "Ecosia"].includes(source)) return "search";
  if (source === "Direct" || !source) return "direct";
  return "other";
}

export function isAiSource(source: string) {
  return AI_LABELS.has(source);
}

// Called once per page load. Keeps the first non-direct source seen (so browsing
// around the site, or returning directly later, doesn't overwrite "TikTok" with "Direct").
export function captureVisitSource() {
  if (typeof window === "undefined") return;
  try {
    const source = classifySource(document.referrer, window.location.search, window.location.hostname);
    const existing = readVisitSource();
    if (existing && (existing.source !== "Direct" || source === "Direct")) return;
    const value: VisitSource = {
      source,
      referrer: document.referrer.slice(0, 500),
      landing: (window.location.pathname + window.location.search).slice(0, 500),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked — ignore */
  }
}

export function readVisitSource(): VisitSource | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VisitSource) : null;
  } catch {
    return null;
  }
}
