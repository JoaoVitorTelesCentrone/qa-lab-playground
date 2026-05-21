-- QA Lab Playground — Supabase Schema
-- Execute este arquivo no SQL Editor do seu projeto Supabase

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username     TEXT UNIQUE,
  full_name    TEXT,
  avatar_url   TEXT,
  bio          TEXT,
  linkedin_url TEXT,
  role         TEXT DEFAULT 'QA Iniciante',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis públicos são visíveis" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuário gerencia seu próprio perfil" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Trigger que cria o perfil automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- WAITLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  role       TEXT,
  source     TEXT DEFAULT 'website',
  status     TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode entrar na waitlist
CREATE POLICY "Qualquer um pode entrar na waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Só admins leem (via service_role key no backend)
CREATE POLICY "Admins leem waitlist" ON waitlist
  FOR SELECT USING (auth.role() = 'service_role');

-- ============================================================
-- MISSION PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS mission_progress (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id   TEXT NOT NULL,
  status       TEXT DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê seu próprio progresso" ON mission_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário salva seu próprio progresso" ON mission_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza seu próprio progresso" ON mission_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário deleta seu próprio progresso" ON mission_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- BUG CHECKLIST (módulo Datas Bugadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS bug_checklist (
  id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bug_id  TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, bug_id)
);

ALTER TABLE bug_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê seu próprio checklist" ON bug_checklist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia seu próprio checklist" ON bug_checklist
  FOR ALL USING (auth.uid() = user_id);
