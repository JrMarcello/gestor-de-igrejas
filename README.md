# Gestor de Igrejas

Sistema completo para gestão de membresia de igrejas com autenticação, gerenciamento de membros, grupos/ministérios e Escola Bíblica Dominical.

## ✨ Funcionalidades

- **Autenticação JWT** - Login/registro seguro
- **Gestão de Membros** - CRUD completo com dados pessoais
- **Grupos e Ministérios** - Organização e associação de membros
- **Escola Bíblica** - Turmas, participantes e controle de presença
- **Dashboard** - Estatísticas e visão geral do sistema
- **API Documentada** - Swagger para testes e integração

## 🛠 Tecnologias

**Backend:** NestJS, Prisma, MongoDB, JWT, Passport.js  
**Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Axios  
**DevOps:** Docker, Docker Compose

## 🚀 Início Rápido

### Com Docker (Recomendado)

```bash
# 1. Clone e navegue para o projeto
cd gestor-de-igrejas

# 2. Configure o backend
cd backend && cp .env.example .env
# Edite o .env com suas configurações

# 3. Execute o projeto
docker compose up -d

# 4. Seed do banco (primeira vez)
docker compose exec backend npx prisma db seed
```

**Acesse:**
- Frontend: http://localhost:3001
- API: http://localhost:3000
- Swagger: http://localhost:3000/api

### Instalação Manual

**Backend:**
```bash
cd backend
pnpm install
cp .env.example .env  # Configure DATABASE_URL e JWT_SECRET
npx prisma generate
npx prisma db seed
pnpm run start:dev
```

**Frontend:**
```bash
cd frontend
pnpm install
echo 'NEXT_PUBLIC_API_URL="http://localhost:3000"' > .env.local
pnpm run dev
```

## 📋 Uso

1. **Login:** Acesse http://localhost:3001/login
2. **Credenciais padrão:** `admin@example.com` / `admin123`
3. **Navegação:** Use a barra superior para acessar os módulos

## 🧪 Testes

```bash
# Backend
cd backend
pnpm test              # Testes unitários
pnpm test:cov          # Com coverage
pnpm test:e2e          # End-to-end
pnpm lint              # Linting

# Frontend
cd frontend
pnpm test              # Testes unitários
pnpm lint              # Linting

# Com Docker
docker compose exec backend pnpm test
docker compose exec frontend pnpm test
```

## 📁 Estrutura

```
gestor-de-igrejas/
├── backend/           # API NestJS
│   ├── src/
│   │   ├── auth/      # Autenticação JWT
│   │   ├── members/   # Gestão de membros
│   │   ├── groups/    # Grupos e ministérios
│   │   ├── biblical-school/ # Escola bíblica
│   │   └── dashboard/ # Estatísticas
│   └── prisma/        # Schema e seed
├── frontend/          # Interface Next.js
│   └── src/
│       ├── app/       # Páginas (App Router)
│       ├── components/ # Componentes React
│       └── contexts/  # Estado global
└── docker-compose.yml # Orquestração
```

## 📝 Variáveis de Ambiente

**Backend (.env):**
```env
DATABASE_URL="mongodb://admin:password@mongodb:27017/gestor_db?authSource=admin"
JWT_SECRET="sua_chave_secreta_jwt"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```