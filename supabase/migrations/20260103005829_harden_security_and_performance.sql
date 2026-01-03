CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public   -- lock it down
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, pg_catalog.split_part(NEW.email, '@', 1))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- PROFILES
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  using ((select auth.uid()) = id);

-- SUBMISSIONS
drop policy if exists submissions_select_own on public.submissions;
create policy submissions_select_own
  on public.submissions for select
  using ((select auth.uid()) = "userId");

drop policy if exists submissions_insert_own on public.submissions;
create policy submissions_insert_own
  on public.submissions for insert
  with check ((select auth.uid()) = "userId");

-- USER PROBLEM STATUS
drop policy if exists ups_select_own on public.user_problem_status;
create policy ups_select_own
  on public.user_problem_status for select
  using ((select auth.uid()) = "userId");

drop policy if exists ups_insert_own on public.user_problem_status;
create policy ups_insert_own
  on public.user_problem_status for insert
  with check ((select auth.uid()) = "userId");

drop policy if exists ups_update_own on public.user_problem_status;
create policy ups_update_own
  on public.user_problem_status for update
  using ((select auth.uid()) = "userId");
