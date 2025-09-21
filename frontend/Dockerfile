# Use uma imagem Node.js oficial como base
FROM node:20-alpine AS base

# Instala pnpm
RUN npm install -g pnpm

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do projeto e instala as dependências
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install --frozen-lockfile

# Copia o restante do código-fonte da aplicação
COPY . .

# Constrói a aplicação Next.js
RUN pnpm run build

# Expõe a porta em que a aplicação Next.js será executada
EXPOSE 3001

# Comando para iniciar a aplicação
CMD [ "pnpm", "run", "start", "-p", "3001" ]
