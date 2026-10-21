-- Alotym bespoke enquiries.
-- Apply this in the Supabase SQL editor or with the Supabase CLI.
-- The website uses only the anon key. Do not put the service-role key in frontend env vars.
-- Secure storage is not complete until this SQL is applied, the owner role is set,
-- and a real submission plus private image upload have been checked.

create table if not exists public.bespoke_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  design_label text not null,
  own_inspiration boolean not null default false,
  inspiration_notes text not null default '',
  occasion text not null default '',
  silhouette text not null default '',
  dress_length text not null default '',
  sleeve text not null default '',
  neckline text not null default '',
  colours text not null default '',
  fabric text not null default '',
  fit text not null default '',
  design_notes text not null default '',
  measurement_unit text not null,
  needs_measurement_help boolean not null default false,
  measurements jsonb not null default '{}'::jsonb,
  fit_notes text not null default '',
  full_name text not null,
  email text not null default '',
  phone text not null,
  country text not null,
  city text not null,
  delivery_destination text not null,
  contact_channel text not null,
  occasion_date text not null default '',
  customer_notes text not null default '',
  image_paths text[] not null default '{}',
  status text not null default 'enquiry_received',
  constraint measurement_unit_known check (measurement_unit in ('cm', 'in')),
  constraint contact_channel_known check (contact_channel in ('whatsapp', 'instagram')),
  constraint status_known check (status = 'enquiry_received'),
  constraint name_length check (char_length(full_name) between 2 and 120),
  constraint phone_length check (char_length(phone) between 6 and 32),
  constraint country_length check (char_length(country) between 2 and 80),
  constraint city_length check (char_length(city) between 2 and 80),
  constraint destination_length check (char_length(delivery_destination) between 2 and 180),
  constraint notes_length check (char_length(customer_notes) <= 2000 and char_length(design_notes) <= 2000 and char_length(inspiration_notes) <= 2000)
);

alter table public.bespoke_enquiries enable row level security;

revoke all on table public.bespoke_enquiries from anon, authenticated;
grant select on table public.bespoke_enquiries to authenticated;

drop policy if exists owner_reads_enquiries on public.bespoke_enquiries;
create policy owner_reads_enquiries
on public.bespoke_enquiries
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

create or replace function public.reference_accepts_upload(reference_token text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bespoke_enquiries
    where reference = reference_token
      and created_at > now() - interval '2 hours'
  );
$$;

create or replace function public.submit_bespoke_enquiry(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_reference text;
  measurement_key text;
  measurement_value text;
  measurement_unit text;
  numeric_value numeric;
  known_keys text[] := array[
    'bust', 'underbust', 'waist', 'hips', 'shoulder_width',
    'shoulder_to_waist', 'dress_length', 'sleeve_length', 'arm_circumference'
  ];
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'enquiry_rejected: The enquiry could not be read.';
  end if;

  if char_length(coalesce(payload->>'full_name', '')) not between 2 and 120 then
    raise exception 'enquiry_rejected: Enter your full name.';
  end if;
  if char_length(coalesce(payload->>'phone', '')) not between 6 and 32 then
    raise exception 'enquiry_rejected: Enter a phone number Alotym can reply to.';
  end if;
  if coalesce(payload->>'email', '') <> '' and (
    char_length(payload->>'email') > 160 or position('@' in payload->>'email') < 2
  ) then
    raise exception 'enquiry_rejected: Enter a valid email address, or leave it blank.';
  end if;
  if char_length(coalesce(payload->>'country', '')) not between 2 and 80
    or char_length(coalesce(payload->>'city', '')) not between 2 and 80
    or char_length(coalesce(payload->>'delivery_destination', '')) not between 2 and 180 then
    raise exception 'enquiry_rejected: Enter the country, city, and delivery destination.';
  end if;
  if coalesce(payload->>'contact_channel', '') not in ('whatsapp', 'instagram') then
    raise exception 'enquiry_rejected: Choose WhatsApp or Instagram.';
  end if;
  if coalesce(payload->>'measurement_unit', '') not in ('cm', 'in') then
    raise exception 'enquiry_rejected: Choose centimetres or inches.';
  end if;
  if char_length(coalesce(payload->>'design_label', '')) not between 1 and 160 then
    raise exception 'enquiry_rejected: Choose a design or describe your own inspiration.';
  end if;
  if char_length(coalesce(payload->>'customer_notes', '')) > 2000
    or char_length(coalesce(payload->>'design_notes', '')) > 2000
    or char_length(coalesce(payload->>'inspiration_notes', '')) > 2000
    or char_length(coalesce(payload->>'fit_notes', '')) > 2000 then
    raise exception 'enquiry_rejected: Shorten the notes and try again.';
  end if;

  if coalesce(payload->'measurements', '{}'::jsonb) = 'null'::jsonb
    or jsonb_typeof(payload->'measurements') <> 'object' then
    raise exception 'enquiry_rejected: Check the measurements and try again.';
  end if;

  if coalesce(payload->>'needs_measurement_help', 'false') <> 'true' then
    if coalesce(payload->'measurements'->'bust'->>'value', '') = ''
      or coalesce(payload->'measurements'->'waist'->>'value', '') = ''
      or coalesce(payload->'measurements'->'hips'->>'value', '') = '' then
      raise exception 'enquiry_rejected: Enter bust, waist, and hips, or ask for measurement help.';
    end if;
  end if;

  for measurement_key in
    select jsonb_object_keys(payload->'measurements')
  loop
    if not (measurement_key = any (known_keys)) then
      raise exception 'enquiry_rejected: A measurement was not recognised.';
    end if;
    measurement_value := coalesce(payload->'measurements'->measurement_key->>'value', '');
    measurement_unit := coalesce(payload->'measurements'->measurement_key->>'unit', '');
    if measurement_value = '' then
      continue;
    end if;
    if measurement_unit not in ('cm', 'in') or measurement_value !~ '^[0-9]+(\.[0-9]+)?$' then
      raise exception 'enquiry_rejected: Check the measurements and try again.';
    end if;
    numeric_value := measurement_value::numeric;
    if numeric_value <= 0
      or (measurement_unit = 'cm' and numeric_value > 400)
      or (measurement_unit = 'in' and numeric_value > 160) then
      raise exception 'enquiry_rejected: Check the measurements and try again.';
    end if;
  end loop;

  new_reference := 'ALY-' || encode(extensions.gen_random_bytes(16), 'hex');

  insert into public.bespoke_enquiries (
    reference,
    design_label,
    own_inspiration,
    inspiration_notes,
    occasion,
    silhouette,
    dress_length,
    sleeve,
    neckline,
    colours,
    fabric,
    fit,
    design_notes,
    measurement_unit,
    needs_measurement_help,
    measurements,
    fit_notes,
    full_name,
    email,
    phone,
    country,
    city,
    delivery_destination,
    contact_channel,
    occasion_date,
    customer_notes
  ) values (
    new_reference,
    left(payload->>'design_label', 160),
    coalesce(payload->>'own_inspiration', 'false') = 'true',
    left(coalesce(payload->>'inspiration_notes', ''), 2000),
    left(coalesce(payload->>'occasion', ''), 80),
    left(coalesce(payload->>'silhouette', ''), 80),
    left(coalesce(payload->>'dress_length', ''), 80),
    left(coalesce(payload->>'sleeve', ''), 80),
    left(coalesce(payload->>'neckline', ''), 80),
    left(coalesce(payload->>'colours', ''), 160),
    left(coalesce(payload->>'fabric', ''), 160),
    left(coalesce(payload->>'fit', ''), 80),
    left(coalesce(payload->>'design_notes', ''), 2000),
    payload->>'measurement_unit',
    coalesce(payload->>'needs_measurement_help', 'false') = 'true',
    payload->'measurements',
    left(coalesce(payload->>'fit_notes', ''), 2000),
    payload->>'full_name',
    left(coalesce(payload->>'email', ''), 160),
    payload->>'phone',
    payload->>'country',
    payload->>'city',
    payload->>'delivery_destination',
    payload->>'contact_channel',
    left(coalesce(payload->>'occasion_date', ''), 40),
    left(coalesce(payload->>'customer_notes', ''), 2000)
  );

  return new_reference;
end;
$$;

create or replace function public.attach_reference_images(reference_token text, image_paths text[])
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  path_item text;
begin
  if reference_token is null or image_paths is null or cardinality(image_paths) > 4 then
    raise exception 'enquiry_rejected: Too many reference images.';
  end if;
  if not public.reference_accepts_upload(reference_token) then
    raise exception 'enquiry_rejected: This enquiry is not open for images.';
  end if;
  foreach path_item in array image_paths loop
    if path_item !~ ('^' || reference_token || '/[A-Za-z0-9._-]{1,180}$')
      or path_item !~* '\.(jpg|jpeg|png|webp|gif)$' then
      raise exception 'enquiry_rejected: A reference image was not accepted.';
    end if;
  end loop;
  update public.bespoke_enquiries
  set image_paths = image_paths
  where reference = reference_token;
  return true;
end;
$$;

revoke all on function public.submit_bespoke_enquiry(jsonb) from public;
revoke all on function public.attach_reference_images(text, text[]) from public;
revoke all on function public.reference_accepts_upload(text) from public;
grant execute on function public.submit_bespoke_enquiry(jsonb) to anon, authenticated;
grant execute on function public.attach_reference_images(text, text[]) to anon, authenticated;
grant execute on function public.reference_accepts_upload(text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bespoke-references',
  'bespoke-references',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists enquiry_reference_upload on storage.objects;
create policy enquiry_reference_upload
on storage.objects
for insert
to anon
with check (
  bucket_id = 'bespoke-references'
  and cardinality(storage.foldername(name)) = 2
  and public.reference_accepts_upload((storage.foldername(name))[1])
);

drop policy if exists owner_reads_reference_images on storage.objects;
create policy owner_reads_reference_images
on storage.objects
for select
to authenticated
using (
  bucket_id = 'bespoke-references'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

-- Owner access: in Authentication > Users, set the owner's app_metadata to {"role":"owner"}.
-- There is no public read policy for enquiries or for the bespoke-references bucket.
