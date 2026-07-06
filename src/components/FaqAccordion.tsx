"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/15 overflow-hidden rounded-lg border border-white/15">
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 bg-white/5 px-5 py-4 text-left font-semibold text-white hover:bg-white/10"
            >
              {faq.q}
              <span className="text-xl leading-none">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div className="bg-white/[0.03] px-5 py-4 text-sm text-white/80">{faq.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
