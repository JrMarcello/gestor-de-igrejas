# Gestor de Igrejas

Plataforma completa para gestão de membresia de igrejas. A API fornece autenticação JWT, cadastro de membros, organização em grupos/ministérios, gerenciamento da Escola Bíblica Dominical e dashboard com indicadores. A interface web consome essa API para oferecer uma experiência administrativa moderna.

## Tecnologias
- **Backend:** NestJS 11, Prisma, MongoDB, JWT, Passport.js
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Axios
- **DevOps:** Docker, Docker Compose, Prisma Migrate

## Estrutura do Projeto
```
gestor-de-igrejas/
├── backend/            # API NestJS (Prisma + MongoDB)
├── frontend/           # Interface Next.js (App Router)
└── docker-compose.yml  # Orquestração dos serviços em contêiner
```

## Pré-requisitos
- Node.js 18 ou superior
- pnpm (recomendado) ou npm
- Docker e Docker Compose (opcional, para subir tudo em contêineres)
- Instância MongoDB acessível (local ou em nuvem)

## Setup do Projeto
### 1. Clonar e entrar no repositório
```bash
git clone <url-do-repositorio>
cd gestor-de-igrejas
```

### 2. Subir com Docker (opção rápida)
```bash
# Preparar variáveis do backend
cd backend && cp .env.example .env
# ajuste DATABASE_URL e JWT_SECRET conforme sua instância MongoDB
cd ..

# Construir e iniciar serviços
docker compose up --build -d

# (opcional) executar seed
docker compose exec backend npx prisma db seed
```
- Frontend: <http://localhost:3001>
- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/api>

### 3. Rodar manualmente
#### Backend
```bash
cd backend
pnpm install
cp .env.example .env  # defina DATABASE_URL e JWT_SECRET
npx prisma generate
npx prisma db seed    # popula dados iniciais (opcional)
pnpm run start:dev
```

#### Frontend
```bash
cd frontend
pnpm install
echo 'NEXT_PUBLIC_API_URL="http://localhost:3000"' > .env.local
pnpm run dev
```
Acesse o app em <http://localhost:3001>. Credenciais padrão (seed): `admin@example.com` / `admin123`.

## Testes
### Backend
```bash
cd backend
pnpm test        # testes unitários
pnpm test:cov    # cobertura de testes
pnpm test:e2e    # testes end-to-end
pnpm lint        # análise estática
```

### Frontend
```bash
cd frontend
pnpm lint        # verificação de código (não há testes automatizados configurados)
```

### Via Docker
```bash
docker compose exec backend pnpm test
docker compose exec frontend pnpm lint
```
