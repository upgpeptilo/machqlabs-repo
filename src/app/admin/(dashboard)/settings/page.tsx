import { getWhatsappNumber } from "@/lib/settings";
import { updateWhatsappNumber } from "@/app/admin/actions";

export const metadata = { title: "Settings – Admin" };

export default async function SettingsPage() {
  const whatsappNumber = await getWhatsappNumber();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1b6b80]">Settings</h1>

      <form
        action={updateWhatsappNumber}
        className="mt-6 max-w-md space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
      >
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="whatsappNumber">
            WhatsApp Number
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Include the country code, digits only (no +, spaces or dashes needed) — e.g.{" "}
            <span className="font-mono">15551234567</span> for +1 (555) 123-4567. This powers the
            WhatsApp button shown on the site and the WhatsApp links next to each order below.
          </p>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            type="text"
            inputMode="tel"
            defaultValue={whatsappNumber}
            placeholder="15551234567"
            className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 focus:border-[#1b6b80] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-[#1b6b80] px-5 py-2.5 font-semibold text-white hover:bg-[#164f5f]"
        >
          Save
        </button>
        {!whatsappNumber && (
          <p className="text-xs text-amber-600">
            No number set yet — the WhatsApp button is hidden on the site until you add one.
          </p>
        )}
      </form>
    </div>
  );
}
