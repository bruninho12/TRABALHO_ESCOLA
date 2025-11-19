# ==========================================
# 🐳 Dockerfile para Backend - Multi-stage
# Otimizado para desenvolvimento e produção
# ==========================================

# Stage 1: Base image
FROM node:18-alpine AS base
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Copiar package files
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Development
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3001
USER node
CMD ["dumb-init", "npm", "run", "dev"]

# Stage 4: Build
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build 2>/dev/null || echo "No build script found"

# Stage 5: Production
FROM base AS production

# Copiar node_modules do stage dependencies
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

# Copiar código fonte
COPY --chown=node:node . .

# Criar diretórios necessários
RUN mkdir -p logs exports && chown -R node:node logs exports

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Security: usar usuário não-root
USER node

# Usar dumb-init para gerenciamento de processos
ENTRYPOINT ["dumb-init", "--"]

EXPOSE 3001
CMD ["npm", "start"]