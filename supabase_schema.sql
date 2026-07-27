-- ====================================================
-- MODERN LIFE RESIDENCE - SCRIPT DE CRIAÇÃO DO BANCO SUPABASE
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

-- 3. TABELA DE OCORRÊNCIAS E MENSAGENS (Canal Direto / Reclamações / Elogios / Respostas)
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

-- 4. TABELA DE MURAL DE RECADOS
CREATE TABLE IF NOT EXISTS public.recados (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    data DATE NOT NULL,
    autor TEXT NOT NULL,
    visibilidade TEXT DEFAULT 'Publico',
    imagem TEXT,
    resumo TEXT,
    texto TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR SEGURANÇA E ACESSO PÚBLICO LEITURA/ESCRITA (RLS PERMISSIVO PARA ANONYMOUS KEY)
ALTER TABLE public.moradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocorrencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir Acesso Total aos Moradores" ON public.moradores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir Acesso Total às Reservas" ON public.reservas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir Acesso Total às Ocorrências" ON public.ocorrencias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir Acesso Total aos Recados" ON public.recados FOR ALL USING (true) WITH CHECK (true);

-- HABILITAR PUBLICACAÇÃO REALTIME (TEMPO REAL)
ALTER PUBLICATION supabase_realtime ADD TABLE public.moradores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ocorrencias;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recados;
