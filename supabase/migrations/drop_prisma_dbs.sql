-- Drop old Prisma-style tables that are no longer used

drop table if exists public."Submission";

drop table if exists public."Problem";

drop table if exists public."User";

drop table if exists public._prisma_migrations;