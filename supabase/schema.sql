-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables with RLS (Row Level Security) enabled
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  profile_url text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint profiles_email_key unique (email)
);

-- Store friend relationships
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  constraint friendships_unique unique (user_id, friend_id)
);

-- Store shared links
create table public.links (
  id uuid default gen_random_uuid() primary key,
  created_by uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  title text not null,
  description text,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Store link shares
create table public.link_shares (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.links(id) on delete cascade not null,
  shared_by uuid references public.profiles(id) on delete cascade not null,
  shared_with uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint link_shares_unique unique (link_id, shared_with)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.links enable row level security;
alter table public.link_shares enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create friendships"
  on public.friendships for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own friendships"
  on public.friendships for update
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can view their own links"
  on public.links for select
  using (auth.uid() = created_by);

create policy "Users can create their own links"
  on public.links for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own links"
  on public.links for update
  using (auth.uid() = created_by);

create policy "Users can delete their own links"
  on public.links for delete
  using (auth.uid() = created_by);

create policy "Users can view links shared with them"
  on public.links for select
  using (
    auth.uid() in (
      select shared_with
      from public.link_shares
      where link_id = id
    )
  );

create policy "Users can view their own link shares"
  on public.link_shares for select
  using (auth.uid() = shared_by or auth.uid() = shared_with);

create policy "Users can create link shares"
  on public.link_shares for insert
  with check (auth.uid() = shared_by);

create policy "Users can delete their own link shares"
  on public.link_shares for delete
  using (auth.uid() = shared_by);

-- Function to generate a random 6-character URL
create or replace function public.generate_profile_url()
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
  exists boolean;
begin
  loop
    -- Generate a random 6-character string
    for i in 1..6 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;

    -- Check if the URL already exists
    select exists(
      select 1 from public.profiles where profile_url = result
    ) into exists;

    -- If the URL doesn't exist, return it
    if not exists then
      return result;
    end if;

    -- If the URL exists, try again
    result := '';
  end loop;
end;
$$ language plpgsql security definer;

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, profile_url)
  values (new.id, new.email, public.generate_profile_url());
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to check rate limits
create or replace function public.check_email_rate_limit(email_address text)
returns boolean as $$
declare
  rate_limit record;
begin
  -- Get or create rate limit record with FOR UPDATE to lock the row
  select * into rate_limit
  from public.email_rate_limits
  where email = email_address
  for update;

  if rate_limit is null then
    -- Use INSERT ... ON CONFLICT to handle race conditions
    insert into public.email_rate_limits (email, last_code_sent_at, codes_sent_in_last_hour)
    values (email_address, now(), 1)
    on conflict (email) do update
    set last_code_sent_at = now(),
        codes_sent_in_last_hour = 1;
    return true;
  end if;

  -- Reset counter if more than 15 minutes has passed
  if now() - rate_limit.last_reset_at > interval '15 minutes' then
    update public.email_rate_limits
    set codes_sent_in_last_hour = 1,
        last_code_sent_at = now(),
        last_reset_at = now()
    where email = email_address;
    return true;
  end if;

  -- Check if we've hit the rate limit (5 codes per 15 minutes)
  if rate_limit.codes_sent_in_last_hour >= 5 then
    return false;
  end if;

  -- Increment the counter
  update public.email_rate_limits
  set codes_sent_in_last_hour = codes_sent_in_last_hour + 1,
      last_code_sent_at = now()
  where email = email_address;

  return true;
end;
$$ language plpgsql security definer;

-- Function to check active codes
create or replace function public.check_active_codes(email_address text)
returns boolean as $$
declare
  active_count integer;
begin
  select count(*) into active_count
  from public.email_codes
  where email = email_address
    and used = false
    and expires_at > now();

  -- Allow maximum 3 active codes per email
  return active_count < 3;
end;
$$ language plpgsql security definer;

-- Function to generate a random 12-character code with rate limiting
create or replace function public.generate_email_code(email_address text)
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  -- Check rate limits
  if not public.check_email_rate_limit(email_address) then
    raise exception 'Rate limit exceeded. Please wait before requesting another code.';
  end if;

  -- Check active codes
  if not public.check_active_codes(email_address) then
    raise exception 'Too many active codes. Please use an existing code or wait for it to expire.';
  end if;

  -- Generate the code
  for i in 1..12 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;

  -- Insert the new code
  insert into public.email_codes (email, code, expires_at)
  values (email_address, result, now() + interval '15 minutes');

  return result;
end;
$$ language plpgsql security definer;

-- Function to verify a code
create or replace function public.verify_email_code(email_address text, code_to_verify text)
returns boolean as $$
declare
  code_record record;
begin
  -- Get the code record with detailed logging
  raise notice 'Verifying code for email: %', email_address;
  raise notice 'Code to verify: %', code_to_verify;

  -- Get the code record
  select * into code_record
  from public.email_codes
  where email = email_address
    and code = code_to_verify
    and used = false
    and expires_at > now()
  for update;

  -- Log the result
  if code_record is null then
    raise notice 'Code not found or invalid';
    -- Check if code exists but is used
    select * into code_record
    from public.email_codes
    where email = email_address
      and code = code_to_verify;

    if code_record is not null then
      raise notice 'Code exists but is used: %', code_record.used;
      raise notice 'Code expired at: %', code_record.expires_at;
    end if;
    return false;
  end if;

  raise notice 'Code found and valid';

  -- Mark the code as used
  update public.email_codes
  set used = true
  where id = code_record.id;

  raise notice 'Code marked as used';
  return true;
end;
$$ language plpgsql security definer;

-- Function to reset rate limits and active codes
create or replace function public.reset_email_limits(email_address text)
returns void as $$
begin
  -- Reset rate limits
  delete from public.email_rate_limits
  where email = email_address;

  -- Mark all active codes as used
  update public.email_codes
  set used = true
  where email = email_address
    and used = false
    and expires_at > now();
end;
$$ language plpgsql security definer; 