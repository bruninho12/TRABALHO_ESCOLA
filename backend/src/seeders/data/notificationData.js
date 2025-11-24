/**
 * @fileoverview Dados de exemplo para notificações
 * Este arquivo contém dados de exemplo para popular o banco de dados com notificações realistas
 */

// Função para gerar notificações de exemplo para o usuário
const getNotificationData = (userId) => {
  // Data atual
  const now = new Date();

  // Datas recentes para notificações (últimos 15 dias)
  const getDaysAgo = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };

  // Dados de notificações
  const notifications = [
    // Notificação de boas-vindas
    {
      userId: userId,
      title: "Bem-vindo ao DespFinancee!",
      message:
        "Obrigado por usar nosso aplicativo. Estamos felizes em ajudá-lo a gerenciar suas finanças pessoais!",
      type: "info",
      isRead: false,
      createdAt: getDaysAgo(1),
    },

    // Alertas de orçamento
    {
      userId: userId,
      title: "Orçamento de Alimentação",
      message: "Você já gastou 80% do seu orçamento de alimentação neste mês.",
      type: "warning",
      isRead: false,
      createdAt: getDaysAgo(2),
    },

    // Alertas de fatura
    {
      userId: userId,
      title: "Fatura em breve",
      message:
        "A fatura do seu cartão de crédito vence em 3 dias. Lembre-se de pagar a tempo!",
      type: "alert",
      isRead: false,
      createdAt: getDaysAgo(3),
    },

    // Alerta de pagamento recorrente
    {
      userId: userId,
      title: "Pagamento Recorrente Amanhã",
      message:
        "Você tem um pagamento recorrente de aluguel agendado para amanhã.",
      type: "info",
      isRead: true,
      createdAt: getDaysAgo(4),
    },

    // Notificação de transação suspeita
    {
      userId: userId,
      title: "Transação Não Usual",
      message:
        "Detectamos uma transação de alto valor não usual em sua conta. Verifique seus registros.",
      type: "alert",
      isRead: false,
      createdAt: getDaysAgo(5),
    },

    // Notificação de economia
    {
      userId: userId,
      title: "Parabéns!",
      message:
        "Você gastou menos em entretenimento este mês em comparação com a média dos últimos 3 meses.",
      type: "info",
      isRead: true,
      createdAt: getDaysAgo(7),
    },

    // Sugestão de orçamento
    {
      userId: userId,
      title: "Sugestão de Orçamento",
      message:
        "Com base em seus gastos, sugerimos criar um orçamento para a categoria Transporte.",
      type: "info",
      isRead: false,
      createdAt: getDaysAgo(8),
    },

    // Alerta de meta de economia
    {
      userId: userId,
      title: "Meta de Economia",
      message:
        "Você alcançou 75% da sua meta de economia para comprar um novo notebook!",
      type: "info",
      isRead: true,
      createdAt: getDaysAgo(10),
    },

    // Dica financeira
    {
      userId: userId,
      title: "Dica Financeira",
      message:
        "Economize mais definindo limites para gastos não essenciais e monitorando-os regularmente.",
      type: "info",
      isRead: true,
      createdAt: getDaysAgo(12),
    },

    // Lembrança de imposto
    {
      userId: userId,
      title: "Lembrete de Imposto",
      message:
        "Faltam 30 dias para o prazo final da declaração de imposto de renda.",
      type: "warning",
      isRead: false,
      createdAt: getDaysAgo(15),
    },
  ];

  return notifications;
};

module.exports = { getNotificationData };
