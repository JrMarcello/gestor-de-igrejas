# Gestor de Igrejas

Um sistema completo para gestão de membresia de igrejas, com funcionalidades de autenticação, gerenciamento de membros, grupos e ministérios, e controle de turmas e presença da Escola Bíblica Dominical.

## Funcionalidades

-   **Autenticação de Usuários:** Registro e login com JWT (JSON Web Tokens).
-   **Gerenciamento de Membros:** CRUD completo para perfis de membros da igreja.
-   **Grupos e Ministérios:** Criação e gestão de grupos/ministérios, com associação de membros.
-   **Escola Bíblica Dominical:** Gerenciamento de turmas, atribuição de alunos e professores, e controle de presença.
-   **Dashboard:** Visão geral com estatísticas e resumos do sistema.

## Tecnologias Utilizadas

### Backend

-   **Framework:** Nest.js
-   **ORM:** Prisma
-   **Banco de Dados:** MongoDB
-   **Autenticação:** Passport.js com JWT e bcrypt para hash de senhas.

### Frontend

-   **Framework:** Next.js (App Router)
-   **Linguagem:** TypeScript
-   **Estilização:** Tailwind CSS
-   **Componentes UI:** shadcn/ui
-   **Requisições HTTP:** Axios

## Estrutura do Projeto

O projeto é dividido em dois diretórios principais:

```
gestor-de-igrejas/
├── backend/ # Projeto Nest.js (API)
│   ├── src/
│   │   ├── auth/             # Módulo de Autenticação (login, signup, JWT strategy, guards)
│   │   ├── members/          # Módulo de Gerenciamento de Membros (CRUD)
│   │   ├── groups/           # Módulo de Gerenciamento de Grupos e Ministérios (CRUD, associação de membros)
│   │   ├── biblical-school/  # Módulo de Escola Bíblica (CRUD de turmas, gestão de participantes, presença)
│   │   ├── dashboard/        # Módulo para dados agregados do Dashboard
│   │   ├── prisma/           # Configuração do PrismaService para injeção de dependência
│   │   └── main.ts           # Ponto de entrada da aplicação Nest.js
│   ├── prisma/               # Configuração do Prisma (schema.prisma, seed.ts)
│   │   └── schema.prisma     # Definição do esquema do banco de dados
│   │   └── seed.ts           # Script para popular o banco de dados com dados iniciais
│   ├── .env.example          # Exemplo de variáveis de ambiente para o backend
│   ├── Dockerfile            # Dockerfile para construir a imagem do backend
│   └── package.json          # Dependências e scripts do backend
│
├── frontend/ # Projeto Next.js (Interface do Usuário)
│   ├── src/
│   │   ├── app/              # Rotas e layout principal da aplicação (App Router)
│   │   │   ├── (auth)/login/ # Página de Login
│   │   │   ├── members/      # Página de listagem e gestão de Membros
│   │   │   ├── groups/       # Página de listagem e gestão de Grupos
│   │   │   ├── biblical-school/ # Página de listagem e gestão da Escola Bíblica
│   │   │   └── page.tsx      # Página inicial (Dashboard)
│   │   ├── components/       # Componentes React reutilizáveis (UI, formulários, layout)
│   │   │   ├── auth/         # Componentes específicos de autenticação (ex: LoginForm)
│   │   │   ├── members/      # Componentes específicos de membros (ex: MemberForm)
│   │   │   ├── groups/       # Componentes específicos de grupos (ex: GroupForm, MemberSelect)
│   │   │   ├── biblical-school/ # Componentes específicos da Escola Bíblica
│   │   │   └── ui/           # Componentes shadcn/ui gerados
│   │   ├── contexts/         # Contextos React para gerenciamento de estado global (ex: AuthContext)
│   │   ├── lib/              # Funções utilitárias (ex: cn para classes CSS)
│   │   └── types/            # Definições de tipos globais ou estendidos
│   ├── .env.local.example    # Exemplo de variáveis de ambiente para o frontend
│   ├── components.json       # Configuração da shadcn/ui
│   ├── Dockerfile            # Dockerfile para construir a imagem do frontend
│   └── package.json          # Dependências e scripts do frontend
│
└── docker-compose.yml        # Configuração do Docker Compose para orquestrar os serviços
```

## Como Rodar o Projeto

Você tem duas opções para rodar o projeto: usando Docker Compose (recomendado para desenvolvimento) ou manualmente.

### Pré-requisitos

-   Node.js (versão 18 ou superior) - *Necessário apenas para rodar manualmente*
-   pnpm (gerenciador de pacotes) - *Necessário apenas para rodar manualmente*
-   Docker e Docker Compose - *Necessário para rodar com Docker Compose*
-   MongoDB (instância local ou na nuvem, ex: MongoDB Atlas) - *Necessário para rodar manualmente*

### Opção 1: Rodar com Docker Compose (Recomendado)

Esta opção configura um ambiente completo com MongoDB, backend e frontend em contêineres Docker.

1.  **Navegue até a raiz do projeto:**
    ```bash
    cd gestor-de-igrejas
    ```
2.  **Crie o arquivo `.env` para o backend:**
    *   Navegue até `gestor-de-igrejas/backend`.
    *   Copie o `.env.example` para `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Edite o arquivo `.env` e configure as variáveis:
        ```env
        # Para Docker Compose, aponte para o serviço 'mongodb' e use as credenciais do docker-compose.yml
        DATABASE_URL="mongodb://admin:password@mongodb:27017/gestor_db?authSource=admin"
        JWT_SECRET="SUA_CHAVE_SECRETA_JWT_AQUI"
        ```
        (Substitua `admin` e `password` se você os alterou no `docker-compose.yml`, e `SUA_CHAVE_SECRETA_JWT_AQUI` pela sua chave JWT real).
3.  **Construa e Inicie os Contêineres:**
    *   Na raiz do projeto (`gestor-de-igrejas`):
        ```bash
        docker compose build
        docker compose up -d
        ```
        Isso construirá as imagens e iniciará os serviços em segundo plano.
4.  **Execute o Seed do Banco de Dados (apenas na primeira vez ou quando precisar):**
    *   Para criar o usuário administrador padrão:
        ```bash
        docker compose exec backend npx prisma db seed
        ```
5.  **Acesse a Aplicação:**
    *   **Frontend:** Abra seu navegador e acesse `http://localhost:3001`.
    *   **Backend API:** A API estará disponível em `http://localhost:3000`.

### Opção 2: Rodar Manualmente (Sem Docker)

Esta opção exige que você tenha Node.js, pnpm e uma instância de MongoDB rodando localmente ou acessível.

#### Backend

1.  Navegue até o diretório do backend:
    ```bash
    cd gestor-de-igrejas/backend
    ```
2.  Instale as dependências:
    ```bash
    pnpm install
    ```
3.  Crie um arquivo `.env` na raiz do diretório `backend` (se ainda não tiver) e configure as variáveis de ambiente:
    *   Copie o `.env.example` para `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Edite o arquivo `.env` e configure as variáveis:
        ```env
        # Para rodar manualmente, aponte para sua instância de MongoDB local ou Atlas
        DATABASE_URL="mongodb+srv://<db_username>:<db_password>@cluster0.atlfwpo.mongodb.net/<database_name>?retryWrites=true&w=majority&appName=Cluster0"
        JWT_SECRET="SUA_CHAVE_SECRETA_JWT_AQUI"
        ```
        (Substitua `<db_username>`, `<db_password>`, `<database_name>` e `SUA_CHAVE_SECRETA_JWT_AQUI` pelos seus dados reais).
4.  Gere o Prisma Client (necessário para o TypeScript):
    ```bash
    npx prisma generate
    ```
5.  Execute o Seed do Banco de Dados (apenas na primeira vez ou quando precisar):
    ```bash
    npx prisma db seed
    ```
6.  Inicie o servidor de desenvolvimento:
    ```bash
    pnpm run start:dev
    ```
    O backend estará rodando em `http://localhost:3000`.

#### Frontend

1.  Navegue até o diretório do frontend em um **novo terminal**:
    ```bash
    cd gestor-de-igrejas/frontend
    ```
2.  Instale as dependências:
    ```bash
    pnpm install
    ```
3.  Crie um arquivo `.env.local` na raiz do diretório `frontend` (se ainda não tiver) e configure a URL da API:
    ```env
    NEXT_PUBLIC_API_URL="http://localhost:3000"
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    pnpm run dev
    ```
    O frontend estará rodando em `http://localhost:3001`.

## Uso da Aplicação

1.  **Criar um Usuário:** Se você não usou o seed, você pode criar um usuário via API (Postman/Insomnia) enviando um `POST` para `http://localhost:3000/auth/signup` com um corpo JSON contendo `email` e `password`.
2.  **Login:** Acesse `http://localhost:3001/login` no seu navegador. Use as credenciais criadas (seja pelo seed ou manualmente) para fazer login.
3.  **Navegação:** Após o login, você será redirecionado para o Dashboard. Use a barra de navegação superior para acessar os módulos de Membros, Grupos e Escola Bíblica.

---