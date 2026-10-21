/*
# Create saves table (single-tenant, no auth)

A text-adventure RPG engine that persists in-progress games to Supabase.
This is a no-auth app: there is no sign-in screen, so the frontend talks
to Supabase entirely as the `anon` role. Policies therefore grant
anon + authenticated full CRUD — the saved-game data is intentionally
public/shared (any visitor can save and resume a game on this device
profile, identified by an anonymous local `save_id`).

1. New Tables
- `saves`
  - `id`          uuid, primary key
  - `save_key`    text, unique. A client-generated stable key (per browser
                  profile) used to upsert/restore a single active save.
  - `module_id`   text, not null. Which game module the save is for.
  - `character_id` text, not null. Which character class is in play.
  - `state`       jsonb, not null. The full serialized GameState blob
                  (stats, inventory, flags, history, sceneId, ended, etc.).
  - `created_at`  timestamptz, default now()
  - `updated_at`  timestamptz, default now()

2. Security
- RLS enabled on `saves`.
- Four policies (select/insert/update/delete) scoped to
  `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`,
  because the data is intentionally shared/public in this no-auth app.
*/

CREATE TABLE IF NOT EXISTS saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  save_key text UNIQUE NOT NULL,
  module_id text NOT NULL,
  character_id text NOT NULL,
  state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saves" ON saves;
CREATE POLICY "anon_select_saves"
ON saves FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saves" ON saves;
CREATE POLICY "anon_insert_saves"
ON saves FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saves" ON saves;
CREATE POLICY "anon_update_saves"
ON saves FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saves" ON saves;
CREATE POLICY "anon_delete_saves"
ON saves FOR DELETE
TO anon, authenticated USING (true);
