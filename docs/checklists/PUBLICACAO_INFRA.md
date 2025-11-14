# Guia de publicação: hospedagem, domínio e backups

## Hospedagem recomendada

- Vercel (frontend React)
- Render, Heroku, AWS ou MongoDB Atlas (backend Node.js/MongoDB)

## Domínio próprio

- Registrar domínio em provedores como Registro.br, GoDaddy, Namecheap
- Configurar DNS para apontar para o serviço de hospedagem

## Backups do banco de dados

- MongoDB Atlas: configurar backups automáticos
- Render/AWS: usar snapshots ou scripts de backup
- Testar restauração periodicamente

## Checklist

- [ ] Frontend publicado em Vercel/Netlify
- [ ] Backend publicado em Render/Heroku/AWS
- [ ] Domínio configurado e apontando para produção
- [ ] Backups automáticos ativos no banco
- [ ] Teste de restauração realizado
