create table if not exists public.profiles (
  share_code text primary key,
  name text not null,
  best_wpm integer not null default 0,
  best_accuracy integer not null default 0,
  average_wpm integer not null default 0,
  total_duration integer not null default 0,
  total_sessions integer not null default 0,
  coins integer not null default 0,
  total_check_ins integer not null default 0,
  season_points integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists coins integer not null default 0;

alter table public.profiles
  add column if not exists total_check_ins integer not null default 0;

alter table public.profiles
  add column if not exists season_points integer not null default 0;

create table if not exists public.friends (
  owner_share_code text not null,
  friend_share_code text not null,
  friend_name text not null,
  source text not null,
  joined_at timestamptz not null default now(),
  invite_url text not null,
  primary key (owner_share_code, friend_share_code)
);

create table if not exists public.training_records (
  id text primary key,
  share_code text not null,
  lesson_id integer,
  challenge_id text,
  duel_id text,
  title text not null,
  mode text not null,
  accuracy integer not null,
  wpm integer not null,
  duration integer not null,
  correct_chars integer not null,
  wrong_chars integer not null,
  xp_gained integer not null,
  stars integer not null,
  error_analysis jsonb,
  created_at text not null
);

alter table public.training_records
  add column if not exists duel_id text;

alter table public.training_records
  add column if not exists error_analysis jsonb;

create index if not exists profiles_best_wpm_idx on public.profiles (best_wpm desc);
create index if not exists profiles_season_points_idx on public.profiles (season_points desc);
create index if not exists records_share_code_idx on public.training_records (share_code);
create index if not exists friends_owner_idx on public.friends (owner_share_code);

create table if not exists public.duels (
  id text primary key,
  title text not null,
  description text not null,
  content text not null,
  goal_accuracy integer not null,
  goal_wpm integer not null,
  time_limit_seconds integer not null,
  challenger_share_code text not null,
  challenger_name text not null,
  opponent_share_code text not null,
  opponent_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.duel_attempts (
  id text primary key,
  duel_id text not null references public.duels(id) on delete cascade,
  share_code text not null,
  name text not null,
  accuracy integer not null,
  wpm integer not null,
  duration integer not null,
  correct_chars integer not null,
  wrong_chars integer not null,
  created_at timestamptz not null default now(),
  unique (duel_id, share_code)
);

create index if not exists duel_attempts_duel_id_idx on public.duel_attempts (duel_id);

create table if not exists public.word_banks (
  id text primary key,
  share_code text not null,
  title text not null,
  category text not null,
  terms jsonb not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id text primary key,
  share_code text not null,
  check_in_date date not null,
  reward_xp integer not null default 0,
  reward_coins integer not null default 0,
  created_at timestamptz not null default now(),
  unique (share_code, check_in_date)
);

create table if not exists public.achievement_unlocks (
  id text primary key,
  share_code text not null,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  meta jsonb,
  unique (share_code, achievement_id)
);

create table if not exists public.daily_mission_claims (
  id text primary key,
  share_code text not null,
  mission_date date not null,
  mission_id text not null,
  created_at timestamptz not null default now(),
  unique (share_code, mission_date, mission_id)
);

create index if not exists daily_mission_claims_share_code_idx on public.daily_mission_claims (share_code, mission_date);
