-- Run this FIRST, once, in the Supabase SQL editor — before re-running schema.sql.
-- Migrates the existing products table from price/sizes to variants.

alter table products add column if not exists variants jsonb not null default '[]';
alter table products drop column if exists price;
alter table products drop column if exists sizes;

-- Confirm it worked — should list variants, and NOT list price or sizes.
select column_name from information_schema.columns where table_name = 'products';
