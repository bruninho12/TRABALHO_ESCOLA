# ==========================================

# 📋 Guia de Deployment com Docker

# Configuração completa para produção

# ==========================================

## 🚀 Início Rápido

### Desenvolvimento Local

```bash
# Iniciar todos os serviços
docker-compose up

# Apenas desenvolvimento (sem Redis)
docker-compose --profile dev up

# Rebuild forçado
docker-compose up --build
```

### Produção

```bash
# Deploy completo de produção
docker-compose --profile production up -d

# Monitoramento de logs
docker-compose logs -f

# Verificar status dos containers
docker-compose ps
```

## 🏗️ Arquitetura dos Containers

### Frontend (React + Nginx)

- **Desenvolvimento**: Vite dev server na porta 5173
- **Produção**: Nginx servindo build otimizado na porta 80
- **Features**:
  - Cache de assets estáticos
  - Compressão gzip
  - Security headers
  - Health check endpoint

### Backend (Node.js + Express)

- **Desenvolvimento**: Node.js com restart automático
- **Produção**: PM2 cluster mode com health checks
- **Security**: Non-root user, minimal base image
- **Features**:
  - Multi-stage build
  - Health checks integrados
  - Log rotation

### Banco de Dados (MongoDB)

- **Persistência**: Volume Docker para dados
- **Backup**: Scripts automatizados
- **Security**: Autenticação habilitada

### Cache (Redis) - Apenas Produção

- **Uso**: Cache de sessões e queries
- **Persistência**: Configurável via volume
- **Performance**: Melhora tempo de resposta

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Parar todos os serviços
docker-compose down

# Remover volumes (cuidado - apaga dados!)
docker-compose down -v

# Logs específicos
docker-compose logs backend
docker-compose logs frontend

# Executar comandos no container
docker-compose exec backend npm run test
docker-compose exec mongodb mongosh
```

### Desenvolvimento

```bash
# Rebuild apenas um serviço
docker-compose up --build frontend

# Escalar serviços
docker-compose up --scale backend=3

# Modo watch para desenvolvimento
docker-compose watch
```

### Produção

```bash
# Deploy sem downtime
docker-compose up -d --no-deps --build frontend

# Backup do banco
docker-compose exec mongodb mongodump --out /backup

# Verificar saúde dos containers
docker-compose exec frontend curl http://localhost/health
docker-compose exec backend curl http://localhost:3000/health
```

## 📊 Monitoramento

### Health Checks

- **Frontend**: `http://localhost/health`
- **Backend**: `http://localhost:3000/health`
- **MongoDB**: Conexão automática verificada

### Logs

```bash
# Logs em tempo real
docker-compose logs -f --tail=100

# Logs por serviço
docker-compose logs backend --since=1h

# Exportar logs
docker-compose logs > deployment.log
```

### Métricas

- Container CPU/Memory: `docker stats`
- Disk usage: `docker system df`
- Network: `docker network ls`

## 🔒 Segurança

### Configurações Aplicadas

- **Non-root users** em todos os containers
- **Security headers** no Nginx
- **Network isolation** entre serviços
- **Volume permissions** configuradas
- **Secrets management** via environment

### Recomendações Adicionais

- Use Docker secrets para senhas
- Configure firewall para portas específicas
- Implemente SSL/TLS com Let's Encrypt
- Configure backup automático

## 🚨 Troubleshooting

### Problemas Comuns

```bash
# Container não inicia
docker-compose logs [service-name]

# Problemas de rede
docker network inspect despfinancee_network

# Problemas de volume
docker volume inspect despfinancee_mongodb_data

# Reset completo (cuidado!)
docker-compose down -v --rmi all
docker-compose up --build
```

### Performance

```bash
# Verificar uso de recursos
docker stats

# Limpeza de cache
docker system prune -f

# Otimizar imagens
docker image prune -f
```

## 📝 Variáveis de Ambiente

### Obrigatórias

- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`
- `JWT_SECRET`
- `VITE_API_URL`

### Opcionais

- `NODE_ENV` (development/production)
- `REDIS_URL` (apenas produção)
- `LOG_LEVEL` (debug/info/warn/error)

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker-compose --profile production up -d --build
```

### Scripts Automatizados

- `scripts/deploy.sh`: Deploy automatizado
- `scripts/backup.sh`: Backup do banco
- `scripts/monitor.sh`: Monitoramento de saúde

## 📈 Otimizações

### Performance

- Multi-stage builds reduzem tamanho das imagens
- Build cache otimizado para desenvolvimento
- Nginx otimizado para servir assets estáticos
- Redis cache em produção

### Desenvolvimento

- Hot reload preservado no frontend
- Volume mounts para código fonte
- Debug ports expostos quando necessário

---

**📞 Suporte**: Para problemas, verifique os logs primeiro: `docker-compose logs`
