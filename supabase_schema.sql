-- ====================================================
-- MODERN LIFE RESIDENCE - SCRIPT DE CRIAÇÃO & PERMISSÕES SUPABASE
-- Copie e cole este código no SQL Editor do seu painel Supabase
-- ====================================================

-- 1. TABELA DE MORADORES
CREATE TABLE IF NOT EXISTS public.moradores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    telefone TEXT,
    apartamento TEXT NOT NULL,
    role TEXT DEFAULT 'Morador',
    status TEXT DEFAULT 'Pendente',
    senha_temporaria BOOLEAN DEFAULT FALSE,
    data_cadastro DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE RESERVAS (Piscina e Academia)
CREATE TABLE IF NOT EXISTS public.reservas (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL,
    data DATE NOT NULL,
    horario TEXT NOT NULL,
    morador_nome TEXT NOT NULL,
    apartamento TEXT NOT NULL,
    email TEXT NOT NULL,
    observacao TEXT,
    status TEXT DEFAULT 'Confirmado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE OCORRÊNCIAS E MENSAGENS
CREATE TABLE IF NOT EXISTS public.ocorrencias (
    id TEXT PRIMARY KEY,
    morador_id TEXT,
    morador_nome TEXT NOT NULL,
    morador_email TEXT NOT NULL,
    apartamento TEXT NOT NULL,
    categoria TEXT DEFAULT 'Canal Direto',
    assunto TEXT NOT NULL,
    descricao TEXT NOT NULL,
    status TEXT DEFAULT 'Enviado ao Síndico',
    respostas JSONB DEFAULT '[]'::jsonb,
    data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR SEGURANÇA E ACESSO PÚBLICO LEITURA/ESCRITA (RLS)
ALTER TABLE public.moradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocorrencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir Moradores" ON public.moradores;
CREATE POLICY "Permitir Moradores" ON public.moradores FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir Reservas" ON public.reservas;
CREATE POLICY "Permitir Reservas" ON public.reservas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir Ocorrencias" ON public.ocorrencias;
CREATE POLICY "Permitir Ocorrencias" ON public.ocorrencias FOR ALL USING (true) WITH CHECK (true);

-- CONCEDER PERMISSÕES DE LEITURA E ESCRITA PARA O CLIENTE ANON
GRANT ALL ON public.moradores TO anon, authenticated, service_role;
GRANT ALL ON public.reservas TO anon, authenticated, service_role;
GRANT ALL ON public.ocorrencias TO anon, authenticated, service_role;
