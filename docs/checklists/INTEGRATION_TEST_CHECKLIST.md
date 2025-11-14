# Checklist de Teste de Integração

1. Cadastro de novo usuário
2. Login e autenticação JWT
3. Registro de transações (despesas/receitas)
4. Visualização de saldo, gráficos e relatórios
5. Criação e acompanhamento de metas e orçamentos
6. Interação com sistema RPG (avatar, batalhas, conquistas)
7. Ganho de XP/ouro ao registrar despesas
8. Notificações e feedbacks visuais
9. Teste de erros e mensagens claras
10. Logout e segurança de sessão

## Como testar

- Realize cada ação pelo frontend e verifique resposta do backend
- Valide se XP/ouro são atualizados ao registrar despesas
- Confira se conquistas são desbloqueadas corretamente
- Teste fluxo completo: cadastro → login → transação → RPG → relatório
- Verifique se erros aparecem de forma clara e amigável

## Observações

- Use usuário demo para testes rápidos
- Consulte logs do backend para monitorar integrações
- Reporte qualquer bug para o suporte
