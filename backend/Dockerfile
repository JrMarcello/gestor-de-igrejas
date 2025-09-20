# Use uma imagem Node.js oficial como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia os arquivos de configuração do projeto e instala as dependências
COPY package.json pnpm-lock.yaml ./ 
RUN pnpm install --frozen-lockfile

# Copia o restante do código-fonte da aplicação
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Constrói a aplicação NestJS
RUN pnpm run build

# Expõe a porta em que a aplicação NestJS será executada
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "pnpm", "run", "start:prod" ]
