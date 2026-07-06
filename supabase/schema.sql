-- Run this once in your Supabase project's SQL editor (Database > SQL Editor > New query).

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  price text not null,
  sizes text[] not null default '{}',
  form text not null default 'Lyophilized Powder',
  image300 text not null,
  image600 text not null,
  best_seller boolean not null default false,
  specs jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table products enable row level security;

-- anyone can read products (storefront)
create policy "Public can view products"
  on products for select
  using (true);

-- only logged-in users (admins) can add/edit/delete
create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

-- storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- seed with the 8 products already on the site
insert into products (slug, title, price, sizes, form, image300, image600, best_seller, specs) values
('ahk-cu', 'AHK-Cu', '£65.99', array['50MG','100MG'], 'Lyophilized Powder', '/images/ahk-cu-300.png', '/images/ahk-cu-600.png', true,
  '[{"label":"CAS Number","value":"89030-95-5"},{"label":"Molecular Formula","value":"~C14H24CuN6O4 (includes copper ion)"},{"label":"Molecular Weight","value":"~403.9 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"H-Ala-His-Lys-OH (AHK) complexed with Cu2+"}]'),
('ghkcu', 'GHK-Cu', '£39.98 – £65.99', array['50MG','100MG'], 'Lyophilized Powder', '/images/ghkcu-300.png', '/images/ghkcu-600.png', true,
  '[{"label":"CAS Number","value":"89030-95-5"},{"label":"Molecular Formula","value":"C14H22CuN6O4"},{"label":"Molecular Weight","value":"≈401.9 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"Gly-His-Lys.Cu.xHAc"}]'),
('glow', 'GLOW', '£77.99', array['70MG'], 'Lyophilized Powder', '/images/glow-300.png', '/images/glow-600.png', true,
  '[{"label":"Blend","value":"GHK-Cu 50mg + BPC-157 10mg + TB-500 10mg"},{"label":"GHK-Cu","value":"CAS 89030-95-5 · C14H22CuN6O4 · ≈401.9 g/mol · ≥99% · Gly-His-Lys.Cu.xHAc"},{"label":"BPC-157","value":"CAS 137525-51-0 · C62H98N16O22 · ~1419.5 g/mol · ≥99% · GEPPPGKPADDAGLV"},{"label":"TB-500","value":"CAS 77591-33-4 · C212H350N56O78S · ~4963.4 g/mol · ≥99% · SDKPDMAEIEKFDKSKLKESQAGETSDDEDVVVTDT"}]'),
('p-141', 'PT-141', '£27.59', array['10MG'], 'Lyophilized Powder', '/images/p-141-300.png', '/images/p-141-600.png', false,
  '[{"label":"CAS Number","value":"189691-06-3"},{"label":"Molecular Formula","value":"C50H68N14O10"},{"label":"Molecular Weight","value":"~1025.2 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH"}]'),
('reta', 'Retatrutide', '£69.98 – £167.99', array['10mg','20mg','40mg'], 'Lyophilized Powder', '/images/reta-300.png', '/images/reta-600.png', true,
  '[{"label":"CAS Number","value":"2381089-83-2"},{"label":"Molecular Formula","value":"C221H342N46O68"},{"label":"Molecular Weight","value":"~4731.3 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"YAQGTFTSDYSILLDKKAQAFIEYLLEGGPSSGAPPPS"}]'),
('snap8', 'SNAP-8', '£39.59', array['10MG'], 'Lyophilized Powder', '/images/snap8-300.png', '/images/snap8-600.png', false,
  '[{"label":"CAS Number","value":"868844-74-0"},{"label":"Molecular Formula","value":"~C41H70N16O16S"},{"label":"Molecular Weight","value":"~1075.2 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2"}]'),
('ta1', 'Thymosin Alpha-1', '£65.99', array['10MG'], 'Lyophilized Powder', '/images/ta1-300.png', '/images/ta1-600.png', false,
  '[{"label":"CAS Number","value":"62304-98-7"},{"label":"Molecular Formula","value":"C129H215N33O55"},{"label":"Molecular Weight","value":"~3108.3 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn-OH"}]'),
('tesamorelin', 'Tesamorelin', '£59.99 – £107.99', array['10MG','20MG'], 'Lyophilized Powder', '/images/tesamorelin-300.png', '/images/tesamorelin-600.png', true,
  '[{"label":"CAS Number","value":"901758-09-6"},{"label":"Molecular Formula","value":"C223H370N72O69S"},{"label":"Molecular Weight","value":"~5135.9 g/mol"},{"label":"Purity","value":"≥99%"},{"label":"Peptide Sequence","value":"YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL"}]')
on conflict (slug) do nothing;
