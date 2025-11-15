export const PLANS = {
  free: {
    name: "Gratuito",
    limits: {
      transactionsPerMonth: 50,
      goalsAdvanced: false,
      exportPDF: false,
      themesPremium: false,
      automations: false,
      levelsAdvanced: false,
    },
  },
  premium: {
    name: "Premium",
    monthly: 4.9,
    features: [
      "Transações ilimitadas",
      "Metas avançadas e automações",
      "Exportações PDF/Excel",
      "Avatares, níveis e conquistas avançadas",
    ],
  },
  lifetime: {
    name: "Vitalício",
    priceOnce: 79.9,
    features: [
      "Tudo do Premium",
      "Pagamento único",
      "Suporte prioritário",
      "Futuras melhorias inclusas",
    ],
  },
};

export default PLANS;
