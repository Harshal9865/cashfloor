-- Calm Ledger: PostgreSQL Schema & Row Level Security (RLS)
-- Enables authenticated cloud sync while keeping data isolated strictly to auth.uid()

-- 1. Ledgers Table
create table if not exists public.ledgers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Primary Freelance Ledger',
  currency_symbol text not null default '$',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_primary_ledger unique(user_id, name)
);

-- 2. Ledger Records (12-Month Inflow & Outflow Entries)
create table if not exists public.ledger_records (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid not null references public.ledgers(id) on delete cascade,
  month text not null,
  income numeric not null default 0 check (income >= 0),
  expenses numeric not null default 0 check (expenses >= 0),
  client_tag text default 'Standard',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Ledger Assumptions & Financial Levers
create table if not exists public.ledger_assumptions (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid not null references public.ledgers(id) on delete cascade unique,
  tax_reserve_pct numeric not null default 0.25,
  buffer_months_multiplier numeric not null default 3.5,
  current_savings numeric not null default 8820,
  percentile integer not null default 20,
  scenario text not null default 'base',
  client_loss_percentage numeric default 0.30,
  windfall_amount numeric default 10000,
  retainer_probability numeric default 0.85,
  updated_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.ledgers enable row level security;
alter table public.ledger_records enable row level security;
alter table public.ledger_assumptions enable row level security;

-- 5. Strict RLS Policies for 'ledgers'
drop policy if exists "Users can view their own ledgers" on public.ledgers;
create policy "Users can view their own ledgers"
  on public.ledgers for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ledgers" on public.ledgers;
create policy "Users can insert their own ledgers"
  on public.ledgers for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ledgers" on public.ledgers;
create policy "Users can update their own ledgers"
  on public.ledgers for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own ledgers" on public.ledgers;
create policy "Users can delete their own ledgers"
  on public.ledgers for delete
  using (auth.uid() = user_id);

-- 6. Strict RLS Policies for 'ledger_records' (via ledger ownership)
drop policy if exists "Users can view their own ledger records" on public.ledger_records;
create policy "Users can view their own ledger records"
  on public.ledger_records for select
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_records.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert their own ledger records" on public.ledger_records;
create policy "Users can insert their own ledger records"
  on public.ledger_records for insert
  with check (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_records.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own ledger records" on public.ledger_records;
create policy "Users can update their own ledger records"
  on public.ledger_records for update
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_records.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own ledger records" on public.ledger_records;
create policy "Users can delete their own ledger records"
  on public.ledger_records for delete
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_records.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

-- 7. Strict RLS Policies for 'ledger_assumptions'
drop policy if exists "Users can view their own ledger assumptions" on public.ledger_assumptions;
create policy "Users can view their own ledger assumptions"
  on public.ledger_assumptions for select
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_assumptions.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert their own ledger assumptions" on public.ledger_assumptions;
create policy "Users can insert their own ledger assumptions"
  on public.ledger_assumptions for insert
  with check (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_assumptions.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own ledger assumptions" on public.ledger_assumptions;
create policy "Users can update their own ledger assumptions"
  on public.ledger_assumptions for update
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_assumptions.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own ledger assumptions" on public.ledger_assumptions;
create policy "Users can delete their own ledger assumptions"
  on public.ledger_assumptions for delete
  using (
    exists (
      select 1 from public.ledgers
      where public.ledgers.id = public.ledger_assumptions.ledger_id
      and public.ledgers.user_id = auth.uid()
    )
  );

-- 8. Indexes for High Performance Queries
create index if not exists idx_ledgers_user_id on public.ledgers(user_id);
create index if not exists idx_ledger_records_ledger_id on public.ledger_records(ledger_id, sort_order);
create index if not exists idx_ledger_assumptions_ledger_id on public.ledger_assumptions(ledger_id);
