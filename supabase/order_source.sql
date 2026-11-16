-- Run this once in your Supabase project's SQL editor (Database > SQL Editor > New query).
--
-- Adds order-source tracking: where the customer came from before ordering
-- (TikTok, Google, ChatGPT / other AI, Instagram, Direct, ...). Shown on /admin/orders.

alter table orders add column if not exists source text not null default 'Direct';
alter table orders add column if not exists referrer text not null default '';
alter table orders add column if not exists landing text not null default '';

-- make the new columns visible to the API immediately
notify pgrst, 'reload schema';
