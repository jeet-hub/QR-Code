create table if not exists public.dynamic_qr_codes (
  id uuid primary key default gen_random_uuid(), code text not null unique check (char_length(code) >= 6), title text not null default 'Untitled QR code', destination_url text not null, scans integer not null default 0, is_active boolean not null default true, created_at timestamptz not null default now()
);
alter table public.dynamic_qr_codes enable row level security;
create policy "Public can create dynamic QR codes" on public.dynamic_qr_codes for insert to anon with check (true);
create policy "Public can read active dynamic QR codes" on public.dynamic_qr_codes for select to anon using (is_active = true);
create or replace function public.increment_dynamic_qr_scans(qr_code_id uuid) returns void language sql security definer set search_path = public as $$ update public.dynamic_qr_codes set scans = scans + 1 where id = qr_code_id and is_active = true; $$;
grant execute on function public.increment_dynamic_qr_scans(uuid) to anon;
