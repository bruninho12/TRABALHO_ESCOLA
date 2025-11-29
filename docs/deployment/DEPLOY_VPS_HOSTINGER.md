# 🚀 Deploy Completo - Hostinger VPS

> Guia profissional para deploy do DespFinancee em VPS Hostinger

---

## 📋 VISÃO GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA FINAL                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USUÁRIOS (HTTPS)                                          │
│       ↓                                                     │
│  ┌──────────────────────────────────────┐                 │
│  │  NGINX (Porta 80/443)                │                 │
│  │  ├─ SSL/TLS (Certbot)                │                 │
│  │  ├─ Frontend (React Build)           │                 │
│  │  └─ Reverse Proxy → Backend          │                 │
│  └──────────────────────────────────────┘                 │
│       ↓                                                     │
│  ┌──────────────────────────────────────┐                 │
│  │  BACKEND (Node.js + Express)         │                 │
│  │  ├─ PM2 (Process Manager)            │                 │
│  │  ├─ Porta 3001 (interno)             │                 │
│  │  └─ API REST + JWT                   │                 │
│  └──────────────────────────────────────┘                 │
│       ↓                                                     │
│  ┌──────────────────────────────────────┐                 │
│  │  MONGODB ATLAS (Cloud)               │                 │
│  │  └─ Backup Automático                │                 │
│  └──────────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 CUSTO MENSAL

| Item                  | Custo                |
| --------------------- | -------------------- |
| VPS Hostinger (KVM 2) | R$ 25-49/mês         |
| MongoDB Atlas (M0)    | R$ 0 (grátis)        |
| Domínio .com.br       | ~R$ 3/mês (opcional) |
| SSL Certificate       | R$ 0 (Let's Encrypt) |
| **TOTAL**             | **R$ 25-49/mês**     |

---

## 🎯 ESPECIFICAÇÕES DA VPS

```
VPS KVM 2 - Hostinger
├─ 2 vCPU cores
├─ 4GB RAM
├─ 80GB NVMe SSD
├─ Ubuntu 22.04 LTS
├─ IP dedicado
└─ 100 Mbps uplink
```

---

## 🚀 PARTE 1: CONFIGURAÇÃO INICIAL DA VPS

### 1.1. Contratar VPS Hostinger

1. Acesse: https://www.hostinger.com.br/vps-hosting
2. Escolha: **VPS KVM 2**
   - 2 vCPU
   - 4GB RAM
   - 80GB SSD
3. Sistema: **Ubuntu 22.04 LTS**
4. Finalizar compra

### 1.2. Acessar VPS via SSH

Após contratação, você receberá:

- **IP do servidor**: `123.456.789.10`
- **Usuário**: `root`
- **Senha**: (enviada por email)

**No Windows (PowerShell)**:

```powershell
ssh root@SEU_IP_AQUI
# Digite a senha quando solicitado
```

**No Linux/Mac**:

```bash
ssh root@SEU_IP_AQUI
```

### 1.3. Atualizar Sistema

```bash
# Atualizar pacotes
apt update && apt upgrade -y

# Instalar ferramentas essenciais
apt install -y curl wget git build-essential
```

### 1.4. Criar Usuário Não-Root (Segurança)

```bash
# Criar usuário
adduser despfinancee
# Digite senha forte e confirme
# Pressione Enter para pular informações adicionais

# Adicionar ao grupo sudo
usermod -aG sudo despfinancee

# Testar (em nova janela de terminal)
ssh despfinancee@SEU_IP_AQUI
sudo apt update  # Deve funcionar
```

**A partir de agora, use o usuário `despfinancee`**, não mais root!

---

## ⚙️ PARTE 2: INSTALAR DEPENDÊNCIAS

### 2.1. Instalar Node.js 18 LTS

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node -v   # Deve mostrar v18.x.x
npm -v    # Deve mostrar 9.x.x
```

### 2.2. Instalar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar
pm2 -v

# Configurar PM2 para iniciar no boot
pm2 startup
# Copie e execute o comando que aparecer
```

### 2.3. Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar e habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx

# Testar
# Acesse http://SEU_IP no navegador
# Deve mostrar "Welcome to nginx!"
```

### 2.4. Instalar Certbot (SSL Grátis)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verificar
certbot --version
```

---

## 📦 PARTE 3: CONFIGURAR APLICAÇÃO

### 3.1. Clonar Repositório

```bash
# Ir para home do usuário
cd ~

# Clonar repositório
git clone https://github.com/bruninho12/TRABALHO_ESCOLA.git

# Renomear pasta (opcional, mais limpo)
mv TRABALHO_ESCOLA despfinancee

# Entrar na pasta
cd despfinancee
```

### 3.2. Configurar Backend

```bash
# Entrar na pasta do backend
cd ~/despfinancee/backend

# Instalar dependências
npm install --production

# Criar arquivo .env de produção
nano .env
```

**Conteúdo do .env**:

```env
# ============================================
# PRODUÇÃO - Hostinger VPS
# ============================================

# Server
NODE_ENV=production
PORT=3001

# MongoDB Atlas (Configure primeiro!)
MONGO_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster.mongodb.net/despfinance?retryWrites=true&w=majority

# JWT (GERE CHAVES NOVAS!)
JWT_SECRET=SUA_CHAVE_SEGURA_32_CARACTERES_AQUI
JWT_REFRESH_SECRET=OUTRA_CHAVE_DIFERENTE_32_CARACTERES
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS (Use seu domínio ou IP)
CORS_ORIGIN=https://seudominio.com.br
FRONTEND_URL=https://seudominio.com.br

# Email (Configure se quiser enviar emails)
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
EMAIL_FROM_NAME=DespFinancee
EMAIL_FROM_EMAIL=noreply@despfinance.com

# Stripe (Produção)
STRIPE_PUBLIC_KEY=pk_live_XXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX

# MercadoPago (Produção)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-XXXXXXXX
MERCADOPAGO_PUBLIC_KEY=APP_USR-XXXXXXXX

# Configurações
EXPERIENCE_PER_LEVEL=100
INITIAL_COINS=100
ACHIEVEMENT_BONUS=50
DEFAULT_CURRENCY=BRL
DEFAULT_LANGUAGE=pt-BR
DEFAULT_TIMEZONE=America/Sao_Paulo

# Debug
DEBUG=false
VERBOSE_LOGGING=false
LOG_LEVEL=warn
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### 3.3. Popular Banco de Dados

```bash
# Ainda em ~/despfinancee/backend

# Configurar MongoDB
npm run db:setup

# Popular com dados demo
npm run db:seed

# Testar conexão
npm run db:check
```

### 3.4. Testar Backend

```bash
# Testar se inicia sem erros
node server.js

# Deve mostrar:
# [INFO] Server running on port 3001
# [INFO] MongoDB connected successfully

# Pressione Ctrl+C para parar
```

### 3.5. Iniciar Backend com PM2

```bash
# Iniciar aplicação
pm2 start server.js --name despfinancee-api

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs despfinancee-api

# Parar logs: Ctrl+C

# Salvar configuração PM2
pm2 save

# Garantir que inicia no boot
pm2 startup
# Execute o comando que aparecer
```

**Comandos úteis do PM2**:

```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 restart all         # Reiniciar todos
pm2 stop all            # Parar todos
pm2 delete all          # Deletar todos
pm2 monit              # Monitor em tempo real
```

---

## 🎨 PARTE 4: BUILD E CONFIGURAR FRONTEND

### 4.1. Build do Frontend

```bash
# Ir para pasta do frontend
cd ~/despfinancee/frontend

# Criar .env de produção
nano .env.production
```

**Conteúdo do .env.production**:

```env
VITE_API_URL=https://seudominio.com.br/api
VITE_ENV=production
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Verificar se criou a pasta dist
ls -la dist/

# Deve ter: index.html, assets/, etc
```

### 4.2. Mover Build para Nginx

```bash
# Criar pasta para o site
sudo mkdir -p /var/www/despfinancee

# Copiar build
sudo cp -r ~/despfinancee/frontend/dist/* /var/www/despfinancee/

# Dar permissões corretas
sudo chown -R www-data:www-data /var/www/despfinancee
sudo chmod -R 755 /var/www/despfinancee

# Verificar
ls -la /var/www/despfinancee/
```

---

## 🌐 PARTE 5: CONFIGURAR NGINX

### 5.1. Configurar Domínio (Se Tiver)

**Antes de continuar**, configure o DNS do seu domínio:

1. Acesse o painel do seu provedor de domínio
2. Adicione um **A Record**:
   - Nome: `@` ou deixe vazio
   - Tipo: `A`
   - Valor: `SEU_IP_DA_VPS`
   - TTL: `3600`
3. Adicione um **CNAME** para www:
   - Nome: `www`
   - Tipo: `CNAME`
   - Valor: `seudominio.com.br`
   - TTL: `3600`

**Aguarde 5-30 minutos** para propagação DNS.

**Testar propagação**:

```bash
ping seudominio.com.br
# Deve retornar o IP da sua VPS
```

### 5.2. Criar Configuração do Nginx

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/despfinancee
```

**Conteúdo** (SEM SSL primeiro):

```nginx
# DespFinancee - Configuração Nginx

# Redirecionar www para não-www
server {
    listen 80;
    server_name www.seudominio.com.br;
    return 301 http://seudominio.com.br$request_uri;
}

# Servidor principal
server {
    listen 80;
    server_name seudominio.com.br;

    # Logs
    access_log /var/log/nginx/despfinancee-access.log;
    error_log /var/log/nginx/despfinancee-error.log;

    # Frontend (React)
    location / {
        root /var/www/despfinancee;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache para assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API (Proxy Reverso)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API Docs (Swagger)
    location /api-docs {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

**Se NÃO tiver domínio**, use o IP:

```nginx
server {
    listen 80;
    server_name SEU_IP_AQUI;
    # ... resto igual
}
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### 5.3. Ativar Configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/despfinancee /etc/nginx/sites-enabled/

# Remover configuração padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Deve mostrar:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar status
sudo systemctl status nginx
```

### 5.4. Testar Aplicação

**Acesse no navegador**:

- Com domínio: `http://seudominio.com.br`
- Sem domínio: `http://SEU_IP`

**Deve carregar o DespFinancee!** 🎉

**Testar API**:

- `http://seudominio.com.br/api/health`
- Deve retornar: `{"status":"ok"}`

---

## 🔒 PARTE 6: CONFIGURAR SSL/HTTPS (Let's Encrypt)

### 6.1. Obter Certificado SSL (GRÁTIS!)

**Apenas se tiver domínio!**

```bash
# Obter certificado
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br

# Responda as perguntas:
# Email: seu_email@gmail.com
# Termos: Y (Yes)
# Newsletter: N (No)
# Redirect HTTP to HTTPS: 2 (Yes)

# Aguarde... deve mostrar:
# Successfully received certificate
# Certificate is saved at: /etc/letsencrypt/live/seudominio.com.br/fullchain.pem
```

### 6.2. Testar HTTPS

**Acesse**: `https://seudominio.com.br`

Deve mostrar **cadeado verde** 🔒 e carregar o site!

### 6.3. Renovação Automática

```bash
# Testar renovação (não renova, só testa)
sudo certbot renew --dry-run

# Deve mostrar: Congratulations, all simulated renewals succeeded

# Configurar auto-renovação (já é automático, mas vamos garantir)
sudo systemctl status certbot.timer

# Deve estar ativo
```

O Certbot renova automaticamente a cada 60 dias!

---

## 🔥 PARTE 7: FIREWALL E SEGURANÇA

### 7.1. Configurar UFW (Firewall)

```bash
# Instalar UFW (se não tiver)
sudo apt install -y ufw

# Permitir SSH (IMPORTANTE!)
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar
sudo ufw status

# Deve mostrar:
# 22/tcp     ALLOW       Anywhere
# 80/tcp     ALLOW       Anywhere
# 443/tcp    ALLOW       Anywhere
```

### 7.2. Fail2Ban (Proteção contra Brute Force)

```bash
# Instalar Fail2Ban
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Procure [sshd] e certifique-se que está:
# enabled = true
# maxretry = 3
# bantime = 3600

# Salvar: Ctrl+O, Enter, Ctrl+X

# Iniciar
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Verificar
sudo fail2ban-client status
```

### 7.3. Atualização Automática de Segurança

```bash
# Instalar
sudo apt install -y unattended-upgrades

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades
# Selecione: Yes

# Verificar
sudo systemctl status unattended-upgrades
```

---

## 📊 PARTE 8: MONITORAMENTO E LOGS

### 8.1. Ver Logs

```bash
# Logs do PM2 (Backend)
pm2 logs despfinancee-api

# Logs do Nginx (Acesso)
sudo tail -f /var/log/nginx/despfinancee-access.log

# Logs do Nginx (Erros)
sudo tail -f /var/log/nginx/despfinancee-error.log

# Logs do sistema
sudo journalctl -f

# Logs do MongoDB (se local)
# (Atlas tem logs no dashboard)
```

### 8.2. Monitoramento com PM2

```bash
# Monitor em tempo real
pm2 monit

# Dashboard web (opcional)
pm2 plus
# Siga instruções para criar conta grátis
```

### 8.3. htop (Monitor de Recursos)

```bash
# Instalar
sudo apt install -y htop

# Executar
htop

# Sair: F10 ou Q
```

---

## 🔄 PARTE 9: DEPLOY DE ATUALIZAÇÕES

### 9.1. Atualizar Aplicação

```bash
# 1. Ir para pasta do projeto
cd ~/despfinancee

# 2. Baixar últimas mudanças
git pull origin master

# 3. Atualizar Backend
cd ~/despfinancee/backend
npm install --production
pm2 restart despfinancee-api

# 4. Atualizar Frontend
cd ~/despfinancee/frontend
npm install
npm run build
sudo rm -rf /var/www/despfinancee/*
sudo cp -r dist/* /var/www/despfinancee/
sudo chown -R www-data:www-data /var/www/despfinancee

# 5. Verificar
pm2 logs despfinancee-api
# Pressione Ctrl+C para sair
```

### 9.2. Script de Deploy Automático

```bash
# Criar script
nano ~/deploy.sh
```

**Conteúdo**:

```bash
#!/bin/bash
# Script de deploy automático - DespFinancee

echo "🚀 Iniciando deploy..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Baixar mudanças
echo -e "${BLUE}📥 Baixando mudanças...${NC}"
cd ~/despfinancee
git pull origin master

# 2. Backend
echo -e "${BLUE}⚙️  Atualizando backend...${NC}"
cd ~/despfinancee/backend
npm install --production
pm2 restart despfinancee-api

# 3. Frontend
echo -e "${BLUE}🎨 Atualizando frontend...${NC}"
cd ~/despfinancee/frontend
npm install
npm run build
sudo rm -rf /var/www/despfinancee/*
sudo cp -r dist/* /var/www/despfinancee/
sudo chown -R www-data:www-data /var/www/despfinancee

# 4. Nginx
echo -e "${BLUE}🌐 Recarregando Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo -e "${GREEN}🌐 Acesse: https://seudominio.com.br${NC}"
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Dar permissão de execução
chmod +x ~/deploy.sh

# Usar assim:
~/deploy.sh
```

---

## 🎯 PARTE 10: OTIMIZAÇÕES

### 10.1. Cache do Nginx

Já configurado no nginx.conf! ✅

### 10.2. Compressão Gzip

Já configurado no nginx.conf! ✅

### 10.3. PM2 Cluster Mode (Usar múltiplos núcleos)

```bash
# Para pela aplicação
pm2 stop despfinancee-api

# Deletar
pm2 delete despfinancee-api

# Iniciar em cluster mode (usa todos os núcleos)
pm2 start server.js --name despfinancee-api -i max

# Verificar
pm2 status

# Deve mostrar múltiplas instâncias!

# Salvar
pm2 save
```

### 10.4. Configurar Swap (Se RAM for pouca)

```bash
# Criar arquivo swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verificar
free -h
```

---

## 🔧 PARTE 11: BACKUP

### 11.1. Backup do Código

```bash
# Criar script de backup
nano ~/backup.sh
```

**Conteúdo**:

```bash
#!/bin/bash
# Backup do DespFinancee

BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="despfinancee_backup_$DATE.tar.gz"

# Criar pasta de backups
mkdir -p $BACKUP_DIR

# Criar backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \
  ~/despfinancee \
  /etc/nginx/sites-available/despfinancee \
  ~/.pm2

echo "✅ Backup criado: $BACKUP_FILE"

# Manter apenas últimos 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs -r rm

echo "🗑️  Backups antigos removidos"
```

**Salvar e executar**:

```bash
chmod +x ~/backup.sh
~/backup.sh
```

### 11.2. Backup Automático (Cron)

```bash
# Editar crontab
crontab -e

# Adicione ao final:
# Backup diário às 3h da manhã
0 3 * * * ~/backup.sh

# Salvar e sair
```

### 11.3. MongoDB Backup

MongoDB Atlas já faz backup automático! ✅

Mas você pode fazer backup manual:

```bash
# Via mongodump (se quiser backup local)
# Instalar MongoDB tools primeiro
```

---

## 🆘 TROUBLESHOOTING

### ❌ Erro: "Cannot connect to MongoDB"

```bash
# 1. Verificar MONGO_URI no .env
cat ~/despfinancee/backend/.env | grep MONGO_URI

# 2. Testar conexão
cd ~/despfinancee/backend
npm run db:check

# 3. Verificar IP whitelist no Atlas
# Adicionar IP da VPS no MongoDB Atlas
# Network Access → Add IP → SEU_IP_VPS
```

### ❌ Erro: "502 Bad Gateway"

```bash
# Backend não está rodando!

# Verificar PM2
pm2 status

# Se não estiver rodando:
cd ~/despfinancee/backend
pm2 start server.js --name despfinancee-api

# Ver logs
pm2 logs despfinancee-api
```

### ❌ Frontend não carrega

```bash
# Verificar arquivos
ls -la /var/www/despfinancee/

# Deve ter index.html e assets/

# Se não tiver, refazer build:
cd ~/despfinancee/frontend
npm run build
sudo cp -r dist/* /var/www/despfinancee/
```

### ❌ HTTPS não funciona

```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --force-renewal

# Verificar configuração Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### ❌ Erro: "Permission denied"

```bash
# Corrigir permissões
sudo chown -R www-data:www-data /var/www/despfinancee
sudo chmod -R 755 /var/www/despfinancee
```

---

## 📊 CHECKLIST FINAL

### ✅ Configuração Inicial

- [ ] VPS contratada na Hostinger
- [ ] SSH funcionando
- [ ] Usuário não-root criado
- [ ] Sistema atualizado

### ✅ Dependências

- [ ] Node.js instalado
- [ ] PM2 instalado
- [ ] Nginx instalado
- [ ] Certbot instalado

### ✅ Aplicação

- [ ] Código clonado
- [ ] Backend configurado (.env)
- [ ] MongoDB populado
- [ ] Backend rodando com PM2
- [ ] Frontend buildado
- [ ] Frontend copiado para Nginx

### ✅ Web Server

- [ ] Nginx configurado
- [ ] Domínio apontando para VPS
- [ ] Site acessível via HTTP
- [ ] SSL configurado (HTTPS)
- [ ] Redirecionamento HTTP → HTTPS

### ✅ Segurança

- [ ] Firewall (UFW) ativo
- [ ] Fail2Ban configurado
- [ ] Atualizações automáticas
- [ ] Usuário root desabilitado para SSH

### ✅ Manutenção

- [ ] PM2 salvo e configurado para boot
- [ ] Logs funcionando
- [ ] Backup automático configurado
- [ ] Script de deploy criado

---

## 🎉 CONCLUSÃO

Parabéns! Você agora tem:

✅ Aplicação rodando 24/7  
✅ HTTPS com certificado válido  
✅ Performance otimizada  
✅ Backup automático  
✅ Segurança configurada  
✅ Deploy profissional

---

## 📱 URLS FINAIS

- **Site**: https://seudominio.com.br
- **API**: https://seudominio.com.br/api
- **Docs**: https://seudominio.com.br/api-docs
- **SSH**: ssh despfinancee@SEU_IP

---

## 🔗 RECURSOS ÚTEIS

- [Hostinger VPS Docs](https://support.hostinger.com/en/collections/1742164-vps)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/)

---

## 💡 PRÓXIMOS PASSOS

1. **Monitoramento**: Configure Sentry ou LogRocket
2. **Analytics**: Adicione Google Analytics
3. **CDN**: Use Cloudflare para cache global
4. **Email**: Configure SMTP para notificações
5. **Pagamentos**: Ative Stripe/MercadoPago em produção

---

**🚀 Seu DespFinancee está no AR de forma PROFISSIONAL!**

**📞 Suporte**: Qualquer dúvida, abra uma issue no GitHub!

---

_Criado em: 25/11/2025_  
_Versão: 2.0.0_  
_Autor: Bruno Souza_  
_Plataforma: Hostinger VPS KVM 2_
