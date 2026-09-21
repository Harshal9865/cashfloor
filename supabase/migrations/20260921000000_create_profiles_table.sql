-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  default_currency text default '$',
  default_tax_rate numeric default 0.25,
  updated_at timestamp with time zone
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create Policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile for a new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up access controls for storage.
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

drop policy if exists "Anyone can update their own avatar." on storage.objects;
create policy "Anyone can update their own avatar." on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid() = owner);
