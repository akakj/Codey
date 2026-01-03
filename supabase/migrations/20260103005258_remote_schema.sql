drop extension if exists "pg_net";

create sequence "public"."Problem_id_seq";

create sequence "public"."Submission_id_seq";

create sequence "public"."problems_id_seq";

create sequence "public"."submissions_id_seq";

create sequence "public"."user_problem_status_id_seq";


  create table "public"."Problem" (
    "id" integer not null default nextval('public."Problem_id_seq"'::regclass),
    "title" text not null,
    "content" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."Submission" (
    "id" integer not null default nextval('public."Submission_id_seq"'::regclass),
    "code" text not null,
    "result" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "userId" text not null,
    "problemId" integer not null
      );



  create table "public"."User" (
    "id" text not null,
    "email" text not null,
    "name" text
      );



  create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
      );



  create table "public"."problems" (
    "id" integer not null default nextval('public.problems_id_seq'::regclass),
    "slug" text,
    "title" text not null,
    "difficulty" text not null
      );


alter table "public"."problems" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."submissions" (
    "id" integer not null default nextval('public.submissions_id_seq'::regclass),
    "userId" uuid not null,
    "problemId" integer not null,
    "code" text not null,
    "language" text not null,
    "passed" boolean not null default false,
    "memory" integer,
    "runtime" integer,
    "createdAt" timestamp with time zone not null default now()
      );


alter table "public"."submissions" enable row level security;


  create table "public"."user_problem_status" (
    "id" integer not null default nextval('public.user_problem_status_id_seq'::regclass),
    "userId" uuid not null,
    "problemId" integer not null,
    "completed" boolean not null default false,
    "lastSubmittedAt" timestamp with time zone
      );


alter table "public"."user_problem_status" enable row level security;

alter sequence "public"."Problem_id_seq" owned by "public"."Problem"."id";

alter sequence "public"."Submission_id_seq" owned by "public"."Submission"."id";

alter sequence "public"."problems_id_seq" owned by "public"."problems"."id";

alter sequence "public"."submissions_id_seq" owned by "public"."submissions"."id";

alter sequence "public"."user_problem_status_id_seq" owned by "public"."user_problem_status"."id";

CREATE UNIQUE INDEX "Problem_pkey" ON public."Problem" USING btree (id);

CREATE UNIQUE INDEX "Submission_pkey" ON public."Submission" USING btree (id);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE UNIQUE INDEX problems_pkey ON public.problems USING btree (id);

CREATE UNIQUE INDEX problems_slug_key ON public.problems USING btree (slug);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX submissions_pkey ON public.submissions USING btree (id);

CREATE INDEX submissions_user_problem_created_idx ON public.submissions USING btree ("userId", "problemId", "createdAt");

CREATE UNIQUE INDEX user_problem_status_pkey ON public.user_problem_status USING btree (id);

CREATE UNIQUE INDEX user_problem_status_user_problem_key ON public.user_problem_status USING btree ("userId", "problemId");

alter table "public"."Problem" add constraint "Problem_pkey" PRIMARY KEY using index "Problem_pkey";

alter table "public"."Submission" add constraint "Submission_pkey" PRIMARY KEY using index "Submission_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."problems" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."submissions" add constraint "submissions_pkey" PRIMARY KEY using index "submissions_pkey";

alter table "public"."user_problem_status" add constraint "user_problem_status_pkey" PRIMARY KEY using index "user_problem_status_pkey";

alter table "public"."Submission" add constraint "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES public."Problem"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Submission" validate constraint "Submission_problemId_fkey";

alter table "public"."Submission" add constraint "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Submission" validate constraint "Submission_userId_fkey";

alter table "public"."problems" add constraint "problems_slug_key" UNIQUE using index "problems_slug_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."submissions" add constraint "submissions_problem_fkey" FOREIGN KEY ("problemId") REFERENCES public.problems(id) ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "submissions_problem_fkey";

alter table "public"."submissions" add constraint "submissions_user_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "submissions_user_fkey";

alter table "public"."user_problem_status" add constraint "ups_problem_fkey" FOREIGN KEY ("problemId") REFERENCES public.problems(id) ON DELETE CASCADE not valid;

alter table "public"."user_problem_status" validate constraint "ups_problem_fkey";

alter table "public"."user_problem_status" add constraint "ups_user_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_problem_status" validate constraint "ups_user_fkey";

alter table "public"."user_problem_status" add constraint "user_problem_status_user_problem_key" UNIQUE using index "user_problem_status_user_problem_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$
;


  create policy "problems_read_all"
  on "public"."problems"
  as permissive
  for select
  to public
using (true);



  create policy "profiles_select_own"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "profiles_update_own"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "submissions_insert_own"
  on "public"."submissions"
  as permissive
  for insert
  to public
with check ((auth.uid() = "userId"));



  create policy "submissions_select_own"
  on "public"."submissions"
  as permissive
  for select
  to public
using ((auth.uid() = "userId"));



  create policy "ups_insert_own"
  on "public"."user_problem_status"
  as permissive
  for insert
  to public
with check ((auth.uid() = "userId"));



  create policy "ups_select_own"
  on "public"."user_problem_status"
  as permissive
  for select
  to public
using ((auth.uid() = "userId"));



  create policy "ups_update_own"
  on "public"."user_problem_status"
  as permissive
  for update
  to public
using ((auth.uid() = "userId"));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


