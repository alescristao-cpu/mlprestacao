# 📑 DOCUMENTAÇÃO TÉCNICA E MANUAL DE OPERAÇÃO
## Portal Oficial do Condomínio Modern Life Residence

> **Gestão:** Síndico Alessandro Cristiano da Silva  
> **E-mail Oficial:** `condominio.modern.life@gmail.com`  
> **URL da Aplicação:** [https://mlprestacao.vercel.app](https://mlprestacao.vercel.app)  
> **Repositório Git:** [https://github.com/alescristao-cpu/mlprestacao.git](https://github.com/alescristao-cpu/mlprestacao.git)  
> **Última Atualização:** 27 de Julho de 2026

---

## 1. 🎯 Visão Geral da Plataforma

O **Portal do Condomínio Modern Life Residence** é uma aplicação web progressiva (Single Page Application - SPA) desenvolvida para garantir transparência financeira, gestão de agendamentos, comunicação direta entre moradores e administração, além de controle rigoroso de portaria e guarita.

### 📜 Provérbio do Rodapé
> *“Vale mais um vizinho perto do que um irmão longe.” — Pv. 27.10*

---

## 2. 🏗️ Arquitetura e Tecnologias

A aplicação utiliza uma arquitetura moderna, leve e sem dependências pesadas de terceiros para garantir máxima velocidade de carregamento em celulares e computadores.

- **Frontend Core:** HTML5 Semântico, Vanilla CSS3 (Design responsivo, HSL Tokens, Glassmorphism e Dark Mode) e JavaScript ES6+ Modular.
- **Banco de Dados Híbrido (Dual Cloud Sync):**
  1. **Supabase PostgreSQL** (`https://lqguxjtczcxbnraoklem.supabase.co`): Banco relacional nativo com API PostgREST e escuta de eventos em Tempo Real via WebSocket (`supabase-js v2`).
  2. **Google Cloud Firestore** (Projeto `paginapretacao`): Banco NoSQL para sincronização em tempo real e backup contínuo.
  3. **LocalStorage (`StoreEngine`)**: Motor local de cache off-line para funcionamento fluido mesmo com instabilidades de rede.
- **Notificações:** Disparo de e-mails via REST API FormSubmit (`_captcha: false`, `_replyto`) e envio direto via **WhatsApp API**.

---

## 3. 👥 Perfis de Acesso e Permissões

### A. 🛡️ Administrador (Síndico Master)
- **Credenciais Master:** E-mail `condominio.modern.life@gmail.com` / Senha `ModernLife2026`.
- **Painel Administrativo (`AdminComponent`):**
  - **Pedidos de Autorização de Novos Cadastros:** Localizado no topo do painel. Exibe solicitações de novos moradores que criaram sua própria senha durante o cadastro, com ações rápidas **`[ ✅ Autorizar Acesso ]`** e **`[ 🚫 Recusar ]`**.
  - **Central de Mensagens do Gestor:** Recebe mensagens do Canal Direto, Reclamações, Elogios e Sugestões enviadas pelos moradores. Permite ao Síndico responder diretamente no site com histórico visível para o morador.
  - **Gerador de Senha Temporária:** Ferramenta exclusiva para moradores **já cadastrados que esqueceram a senha**. Permite gerar uma senha provisória enviada por e-mail e com link de 1-clique para o **WhatsApp do Morador**.
  - **Gestão Financeira:** Controle de Prestação de Contas, Balancetes, Contratos e Mural de Recados.

### B. 🏡 Moradores (Cadastrados e Aprovados)
- **Identificação:** Nome do morador logado exibido de forma destacada na barra superior (cabeçalho).
- **Módulos Acessíveis:**
  - Prestação de Contas e Balancetes Consolidados.
  - Contratos Vigentes e Documentos/Manuais Oficiais.
  - Mural de Recados e Galeria do Condomínio.
  - **Reclamações & Elogios / Canal Direto:** Envio de postagens internas sem necessidade de aplicativo de e-mail externo. As respostas do Síndico aparecem diretamente no painel do morador.
  - **Utilidades & Reservas (Piscina e Academia):** Agendamento individual. **Privacidade Rigorosa:** Cada morador visualiza exclusivamente os seus próprios agendamentos (filtro estrito por e-mail `user.email`).
- **Segurança da Senha:** Na tela de cadastro exibe o aviso de segurança. Se o morador entrar com uma senha temporária, o sistema exige obrigatoriamente a criação de uma nova senha pessoal antes de liberar a navegação.

### C. 🚪 Portaria & Guarita
- **Credenciais:** E-mail `portaria.modern.life@gmail.com` / Senha `123456`.
- **Painel da Portaria (`PortariaComponent`):**
  - Visão geral completa de todos os agendamentos da Piscina e Academia para controle de acesso físico.
  - Ao clicar em **`[ Autorizar Uso ]`**, a ação alterna para a badge verde **`✓ Entrada Liberada`**, impedindo cliques duplicados.

---

## 4. 🗄️ Estrutura de Tabelas do Supabase (PostgreSQL)

```sql
-- 1. MORADORES
CREATE TABLE public.moradores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    telefone TEXT,
    apartamento TEXT NOT NULL,
    role TEXT DEFAULT 'Morador',
    status TEXT DEFAULT 'Pendente',
    senha_temporaria BOOLEAN DEFAULT FALSE,
    data_cadastro DATE DEFAULT CURRENT_DATE
);

-- 2. RESERVAS (Piscina & Academia)
CREATE TABLE public.reservas (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL,
    data DATE NOT NULL,
    horario TEXT NOT NULL,
    morador_nome TEXT NOT NULL,
    apartamento TEXT NOT NULL,
    email TEXT NOT NULL,
    observacao TEXT,
    status TEXT DEFAULT 'Confirmado'
);

-- 3. OCORRÊNCIAS & MENSAGENS INTERNAS
CREATE TABLE public.ocorrencias (
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
    data TEXT NOT NULL
);
```

---

## 5. 🛠️ Manutenção e Procedimentos Frequentes

1. **Aprovação de Novo Morador:**
   - Acesse o *Painel do Síndico*.
   - Localize o cartão em destaque: **Pedidos de Autorização de Novos Cadastros**.
   - Clique em **`[ ✅ Autorizar Acesso do Morador ]`**. O morador receberá um e-mail informando a liberação e poderá entrar com seu e-mail e a senha que ele próprio criou.

2. **Morador Esqueceu a Senha:**
   - Acesse o *Painel do Síndico*.
   - Clique em **`🔑 Senha Temporária`**.
   - Selecione o morador e confirme. O sistema exibirá a senha temporária, enviará um e-mail e fornecerá o botão **`[ 📱 Enviar Senha no WhatsApp ]`**.
   - No primeiro login, o morador será obrigado a cadastrar sua nova senha pessoal.

3. **Inclusão de Novos Documentos ou Balancetes:**
   - No *Painel do Síndico*, utilize as seções de upload/cadastro para anexar PDFs e demonstrativos contábeis.

---

*Documentação mantida e atualizada continuamente pela equipe de desenvolvimento e gestão do Condomínio Modern Life Residence.*
