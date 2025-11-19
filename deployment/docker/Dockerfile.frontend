# ==========================================
# 🐳 Dockerfile para Frontend - Multi-stage
# Otimizado para desenvolvimento e produção
# ==========================================

# Stage 1: Base image
FROM node:18-alpine AS base
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copiar package files
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Development dependencies
FROM base AS dev-dependencies
RUN npm ci

# Stage 4: Development
FROM dev-dependencies AS development
COPY . .
EXPOSE 5173
USER node
CMD ["dumb-init", "npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 5: Build
FROM dev-dependencies AS build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY . .
RUN npm run build

# Stage 6: Production
FROM nginx:alpine AS production

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Adicionar health check
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]