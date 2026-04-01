-- Backteam 데이터베이스 스키마
create table if not exists public.profiles (
  id uuid primary key,
  name text not null,
  phone text not null,
  email text unique not null,
  grade int,
  class int,
  number int,
  is_teacher boolean not null default false,
  tech_stacks text[] not null default '{}'
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  title text not null,
  content text not null,
  recruitment_count int not null,
  tech_required text[] not null default '{}',
  custom_questions jsonb not null default '[]'::jsonb,
  deadline date not null,
  status text not null check (status in ('active', 'closed'))
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id),
  applicant_id uuid not null references public.profiles(id),
  answers jsonb not null default '{}'::jsonb,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  message text not null,
  is_read boolean not null default false,
  link text not null
);
