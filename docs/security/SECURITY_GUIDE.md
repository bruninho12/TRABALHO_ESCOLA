# 🛡️ Guia de Segurança - DespFinancee

## ✅ Melhorias Implementadas

### 🔐 Autenticação e Autorização

1. **JWT Tokens Seguros**

   - Chaves secretas com mínimo de 32 caracteres
   - Tokens de refresh separados dos tokens de acesso
   - Expiração configurável de tokens
   - Blacklist de tokens para logout seguro

2. **Validação de Senhas**

   - Mínimo 8 caracteres
   - Obrigatório: maiúsculas, minúsculas e números
   - Lista de senhas comuns bloqueadas
   - Hash com bcrypt (12 rounds configurável)

3. **Rate Limiting Adaptável**
   - Login: 5 tentativas por 15 minutos
   - API geral: 100 requests por 15 minutos
   - Upload: 5 uploads por 15 minutos
   - Criação de recursos: 10 por hora

### 🔒 Proteção de Entrada

1. **Sanitização Avançada**

   - Remoção de caracteres nulos
   - Escape de HTML malicioso
   - Limitação de comprimento de strings
   - Validação de tipos de dados

2. **Validação Rigorosa**

   - Validação de email com domínios bloqueados
   - Validação de valores monetários
   - Validação de IDs MongoDB
   - Sanitização recursiva de objetos

3. **Detecção de Anomalias**
   - User agents suspeitos
   - Tentativas de path traversal
   - Padrões de injeção SQL
   - Monitoramento de IPs maliciosos

### 🌐 Segurança de Rede

1. **Headers de Segurança (Helmet.js)**

   - Content Security Policy
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security
   - X-XSS-Protection

2. **CORS Configurado**
   - Lista específica de origens permitidas
   - Credenciais habilitadas apenas para origens confiáveis
   - Headers customizados controlados

### 📊 Logging e Monitoramento

1. **Logs Estruturados**

   - Logs de segurança separados
   - Auditoria de operações críticas
   - Logs de tentativas de login
   - Monitoramento de performance

2. **Alertas Automáticos**
   - Tentativas de login falhadas
   - Atividades suspeitas
   - Rate limiting atingido
   - Operações críticas

## ⚙️ Configurações de Produção

### 1. Variáveis de Ambiente Críticas

```bash
# Segurança JWT
JWT_SECRET=sua_chave_muito_segura_32_caracteres_minimo
JWT_REFRESH_SECRET=chave_diferente_32_caracteres_minimo
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutos
RATE_LIMIT_MAX=100    # requests
RATE_LIMIT_DISABLE=false

# Logging
LOG_LEVEL=info
VERBOSE_LOGGING=false

# CORS
CORS_ORIGIN=https://seu-dominio.com
FRONTEND_URL=https://seu-dominio.com
```

### 2. MongoDB Seguro

```bash
# Use sempre MongoDB Atlas para produção
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Configure IP Whitelist no MongoDB Atlas
# Use usuários com permissões mínimas necessárias
```

### 3. HTTPS Obrigatório

```bash
# Certificados SSL/TLS
SSL_KEY=/path/to/private.key
SSL_CERT=/path/to/certificate.crt
NODE_ENV=production
```

## 🚨 Checklist de Segurança

### Antes do Deploy

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Chaves JWT têm pelo menos 32 caracteres e são diferentes
- [ ] CORS está configurado apenas para domínios específicos
- [ ] Rate limiting está habilitado
- [ ] Logs de segurança estão funcionando
- [ ] Certificados SSL/TLS estão válidos
- [ ] Backup do banco de dados está configurado

### Monitoramento Contínuo

- [ ] Alertas de tentativas de login falhadas
- [ ] Monitoramento de rate limiting
- [ ] Logs de atividades suspeitas
- [ ] Performance das consultas
- [ ] Espaço em disco para logs
- [ ] Rotação de logs configurada

### Auditoria Regular

- [ ] Revisão de logs de segurança semanalmente
- [ ] Atualização de dependências mensalmente
- [ ] Teste de penetração trimestral
- [ ] Backup e recovery testados
- [ ] Políticas de senha revisadas

## 🛠️ Ferramentas de Monitoramento

### 1. Logs Centralizados

Os logs são salvos em:

- `logs/app.log` - Logs gerais
- `logs/error.log` - Erros da aplicação
- `logs/security.log` - Eventos de segurança

### 2. Métricas de Segurança

```javascript
// Exemplo de monitoramento
logger.security("Tentativa de login suspeita", {
  email: "usuario@email.com",
  ip: "192.168.1.1",
  userAgent: "navegador",
  timestamp: "2024-01-01T10:00:00Z",
});
```

### 3. Alertas Recomendados

- Mais de 10 logins falhados por minuto
- Rate limiting atingido por IPs únicos
- Tentativas de SQL injection
- User agents suspeitos
- Operações críticas executadas

## 🔧 Manutenção de Segurança

### Atualizações Regulares

1. **Dependências**

   ```bash
   npm audit          # Verificar vulnerabilidades
   npm audit fix      # Corrigir automaticamente
   npm outdated       # Verificar versões desatualizadas
   ```

2. **Monitoramento Contínuo**

   ```bash
   # Verificar logs de segurança
   tail -f logs/security.log

   # Analisar tentativas de login
   grep "LOGIN FAILED" logs/security.log

   # Verificar atividades suspeitas
   grep "SUSPICIOUS" logs/security.log
   ```

3. **Backup e Recovery**
   - Backup automático diário do MongoDB
   - Teste de restore mensal
   - Backup dos logs de segurança
   - Plano de disaster recovery

## ⚠️ Incidentes de Segurança

### Procedimentos de Resposta

1. **Detecção**

   - Monitoramento automático de alertas
   - Análise de logs suspeitos
   - Relatórios de usuários

2. **Contenção**

   - Bloqueio imediato de IPs maliciosos
   - Invalidação de tokens comprometidos
   - Isolamento de recursos afetados

3. **Investigação**

   - Análise forense de logs
   - Identificação do vetor de ataque
   - Avaliação de dados comprometidos

4. **Recovery**
   - Restore de backups se necessário
   - Patches de segurança
   - Comunicação com usuários afetados

## 📞 Contatos de Emergência

- **Desenvolvedor Principal**: Bruno Souza
- **DevOps**: [Configurar]
- **Segurança**: [Configurar]
- **Legal/Compliance**: [Configurar]

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Guide](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Última Atualização**: Novembro 2024  
**Versão**: 2.0  
**Próxima Revisão**: Dezembro 2024
