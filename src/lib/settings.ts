import { createClient } from "@/lib/supabase/server";

/** Server-only reads from the `settings` key/value table. Returns "" if unset or not configured yet. */
export async function getSetting(key: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

export async function getWhatsappNumber(): Promise<string> {
  return getSetting("whatsapp_number");
}
