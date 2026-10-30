-- This invoker trigger only updates its row; keep name resolution deterministic.
alter function public.touch_mentorship_updated_at()
  set search_path = pg_catalog, public;
