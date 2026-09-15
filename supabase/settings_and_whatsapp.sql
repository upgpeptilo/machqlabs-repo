-- Run this once in your Supabase project's SQL editor (Database > SQL Editor > New query),
-- after schema.sql has already been run.
--
-- Adds:
--   1. a generic key/value `settings` table, used to store the WhatsApp number so it can be
--      changed any time from /admin/settings without a code deploy
--   2. a `phone` column on `orders`, collected at checkout, so an order can be opened
--      directly in a WhatsApp chat with that customer from the admin orders page

create table if not exists settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table settings enable row level security;

-- RLS policies only apply on top of base grants — without these, anon/authenticated
-- have no underlying privilege on this table and every query 42501s regardless of policy
grant select on settings to anon, authenticated;
grant insert, update on settings to authenticated;

-- the storefront (anon visitors) needs to read the WhatsApp number to render the
-- floating button and the order-confirmation link; only logged-in admins can change it
drop policy if exists "Public can view settings" on settings;
create policy "Public can view settings"
  on settings for select
  using (true);

drop policy if exists "Authenticated users can insert settings" on settings;
create policy "Authenticated users can insert settings"
  on settings for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update settings" on settings;
create policy "Authenticated users can update settings"
  on settings for update
  to authenticated
  using (true);

-- seed the row the admin settings page edits — set the real number from /admin/settings
insert into settings (key, value) values ('whatsapp_number', '')
on conflict (key) do nothing;

-- customer's WhatsApp/phone number, collected at checkout (optional)
alter table orders add column if not exists phone text not null default '';
