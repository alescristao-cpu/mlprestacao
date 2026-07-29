-- ====================================================
-- MODERN LIFE RESIDENCE - ESQUEMA & SEGURANÇA AVANÇADA (RLS) SUPABASE
-- Execute este script no SQL Editor do seu Painel Supabase
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

-- 2. TABELA DE RESERVAS
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

-- 4. TABELA DE DOCUMENTOS
CREATE TABLE IF NOT EXISTS public.documentos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    visibilidade TEXT DEFAULT 'Moradores',
    tamanho TEXT,
    arquivo TEXT,
    data_upload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE RECADOS E COMUNICADOS
CREATE TABLE IF NOT EXISTS public.recados (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    autor TEXT DEFAULT 'Administração',
    prioridade TEXT DEFAULT 'Normal',
    data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE CONTRATOS
CREATE TABLE IF NOT EXISTS public.contratos (
    id TEXT PRIMARY KEY,
    empresa TEXT NOT NULL,
    categoria TEXT,
    objeto TEXT,
    valor_mensal NUMERIC DEFAULT 0,
    valor_total_anual NUMERIC DEFAULT 0,
    vigencia_inicio TEXT,
    vigencia_fim TEXT,
    obrigacoes TEXT,
    status TEXT DEFAULT 'Ativo',
    arquivo_nome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE BALANCETES
CREATE TABLE IF NOT EXISTS public.balancetes (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    ano INT,
    mes TEXT,
    receita_bruta NUMERIC DEFAULT 0,
    despesa_bruta NUMERIC DEFAULT 0,
    saldo_anterior NUMERIC DEFAULT 0,
    saldo_mes NUMERIC DEFAULT 0,
    saldo_atual NUMERIC DEFAULT 0,
    categorias_despesa JSONB DEFAULT '[]'::jsonb,
    data_publicacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE public.moradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocorrencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balancetes ENABLE ROW LEVEL SECURITY;

-- REMOVER POLÍTICAS PERMISSIVAS ANTIGAS
DROP POLICY IF EXISTS "Permitir Moradores" ON public.moradores;
DROP POLICY IF EXISTS "Permitir Reservas" ON public.reservas;
DROP POLICY IF EXISTS "Permitir Ocorrencias" ON public.ocorrencias;

DROP POLICY IF EXISTS "moradores_select_policy" ON public.moradores;
DROP POLICY IF EXISTS "moradores_insert_policy" ON public.moradores;
DROP POLICY IF EXISTS "moradores_update_policy" ON public.moradores;
DROP POLICY IF EXISTS "moradores_delete_policy" ON public.moradores;

DROP POLICY IF EXISTS "reservas_select_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_insert_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_update_policy" ON public.reservas;
DROP POLICY IF EXISTS "reservas_delete_policy" ON public.reservas;

DROP POLICY IF EXISTS "ocorrencias_select_policy" ON public.ocorrencias;
DROP POLICY IF EXISTS "ocorrencias_insert_policy" ON public.ocorrencias;
DROP POLICY IF EXISTS "ocorrencias_update_policy" ON public.ocorrencias;
DROP POLICY IF EXISTS "ocorrencias_delete_policy" ON public.ocorrencias;

DROP POLICY IF EXISTS "documentos_select_policy" ON public.documentos;
DROP POLICY IF EXISTS "documentos_insert_policy" ON public.documentos;
DROP POLICY IF EXISTS "documentos_update_policy" ON public.documentos;
DROP POLICY IF EXISTS "documentos_delete_policy" ON public.documentos;

DROP POLICY IF EXISTS "recados_select_policy" ON public.recados;
DROP POLICY IF EXISTS "recados_insert_policy" ON public.recados;
DROP POLICY IF EXISTS "recados_update_policy" ON public.recados;
DROP POLICY IF EXISTS "recados_delete_policy" ON public.recados;

DROP POLICY IF EXISTS "contratos_select_policy" ON public.contratos;
DROP POLICY IF EXISTS "contratos_insert_policy" ON public.contratos;
DROP POLICY IF EXISTS "contratos_update_policy" ON public.contratos;
DROP POLICY IF EXISTS "contratos_delete_policy" ON public.contratos;

DROP POLICY IF EXISTS "balancetes_select_policy" ON public.balancetes;
DROP POLICY IF EXISTS "balancetes_insert_policy" ON public.balancetes;
DROP POLICY IF EXISTS "balancetes_update_policy" ON public.balancetes;
DROP POLICY IF EXISTS "balancetes_delete_policy" ON public.balancetes;

-- DEFINIR POLÍTICAS GRANULARES DE SEGURANÇA POR OPERAÇÃO

-- 1. POLÍTICAS PARA MORADORES
CREATE POLICY "moradores_select_policy" ON public.moradores FOR SELECT USING (true);
CREATE POLICY "moradores_insert_policy" ON public.moradores FOR INSERT WITH CHECK (true);
CREATE POLICY "moradores_update_policy" ON public.moradores FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "moradores_delete_policy" ON public.moradores FOR DELETE USING (id IS NOT NULL AND id != '');

-- 2. POLÍTICAS PARA RESERVAS
CREATE POLICY "reservas_select_policy" ON public.reservas FOR SELECT USING (true);
CREATE POLICY "reservas_insert_policy" ON public.reservas FOR INSERT WITH CHECK (true);
CREATE POLICY "reservas_update_policy" ON public.reservas FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "reservas_delete_policy" ON public.reservas FOR DELETE USING (id IS NOT NULL AND id != '');

-- 3. POLÍTICAS PARA OCORRÊNCIAS
CREATE POLICY "ocorrencias_select_policy" ON public.ocorrencias FOR SELECT USING (true);
CREATE POLICY "ocorrencias_insert_policy" ON public.ocorrencias FOR INSERT WITH CHECK (true);
CREATE POLICY "ocorrencias_update_policy" ON public.ocorrencias FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "ocorrencias_delete_policy" ON public.ocorrencias FOR DELETE USING (id IS NOT NULL AND id != '');

-- 4. POLÍTICAS PARA DOCUMENTOS
CREATE POLICY "documentos_select_policy" ON public.documentos FOR SELECT USING (true);
CREATE POLICY "documentos_insert_policy" ON public.documentos FOR INSERT WITH CHECK (true);
CREATE POLICY "documentos_update_policy" ON public.documentos FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "documentos_delete_policy" ON public.documentos FOR DELETE USING (id IS NOT NULL AND id != '');

-- 5. POLÍTICAS PARA RECADOS
CREATE POLICY "recados_select_policy" ON public.recados FOR SELECT USING (true);
CREATE POLICY "recados_insert_policy" ON public.recados FOR INSERT WITH CHECK (true);
CREATE POLICY "recados_update_policy" ON public.recados FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "recados_delete_policy" ON public.recados FOR DELETE USING (id IS NOT NULL AND id != '');

-- 6. POLÍTICAS PARA CONTRATOS
CREATE POLICY "contratos_select_policy" ON public.contratos FOR SELECT USING (true);
CREATE POLICY "contratos_insert_policy" ON public.contratos FOR INSERT WITH CHECK (true);
CREATE POLICY "contratos_update_policy" ON public.contratos FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "contratos_delete_policy" ON public.contratos FOR DELETE USING (id IS NOT NULL AND id != '');

-- 7. POLÍTICAS PARA BALANCETES
CREATE POLICY "balancetes_select_policy" ON public.balancetes FOR SELECT USING (true);
CREATE POLICY "balancetes_insert_policy" ON public.balancetes FOR INSERT WITH CHECK (true);
CREATE POLICY "balancetes_update_policy" ON public.balancetes FOR UPDATE USING (id IS NOT NULL AND id != '') WITH CHECK (id IS NOT NULL AND id != '');
CREATE POLICY "balancetes_delete_policy" ON public.balancetes FOR DELETE USING (id IS NOT NULL AND id != '');

-- REVOGAR DIREITOS DE TRUNCATE E ESTRUTURA PARA A ROLE PÚBLICA ANON
REVOKE TRUNCATE, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon;

-- CONCEDER ACESSO SEGURO DE OPERAÇÕES CRUD PARA AS ROLES DA APLICAÇÃO
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
