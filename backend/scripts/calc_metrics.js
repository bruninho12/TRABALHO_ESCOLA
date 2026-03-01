/*
Script: calc_metrics.js
Calcula métricas básicas a partir do banco Mongo:
- MRR (soma de assinaturas ativas por mês)
- Churn (cancelamentos no período / base ativa no início do período)
- CAC (se fornecer gasto de marketing para intervalo)

Uso (exemplo):
  node calc_metrics.js --months=3 --days=30 --spend=1000 --from=2026-01-01 --to=2026-01-31

Requer variável de ambiente MONGO_URI configurada.
*/

const { connectDB } = require("../src/config/mongoConfig");
const User = require("../src/models/User");
const Payment = require("../src/models/Payment");

const PRICE_MAP = {
  bronze: 0,
  silver: 9.9,
  gold: 19.9,
  platinum: 29.9,
};

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  args.forEach((a) => {
    const [k, v] = a.split("=");
    const key = k.replace(/^--/, "");
    out[key] = v === undefined ? true : v;
  });
  return out;
}

async function calcMRR() {
  // Soma dos preços dos usuários com assinatura ativa
  const activeUsers = await User.find({
    "subscription.isActive": true,
    "subscription.plan": { $in: ["silver", "gold", "platinum"] },
  }).select("subscription.plan");

  let mrr = 0;
  activeUsers.forEach((u) => {
    const plan = u.subscription?.plan || "bronze";
    mrr += PRICE_MAP[plan] || 0;
  });

  return { mrr: Number(mrr.toFixed(2)), activeCount: activeUsers.length };
}

async function calcMonthlyRevenue(months = 3) {
  // Agrega pagamentos concluídos do tipo subscription por mês
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - months + 1);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const agg = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: start },
        status: "completed",
        type: "subscription",
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Mapear para meses contínuos
  const results = [];
  const cursor = new Date(start);
  for (let i = 0; i < months; i++) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const found = agg.find((a) => a._id.year === year && a._id.month === month);
    results.push({
      year,
      month,
      total: found ? Number(found.total.toFixed(2)) : 0,
      count: found ? found.count : 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return results;
}

async function calcChurn(days = 30) {
  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Cancelamentos no período
  const canceledCount = await User.countDocuments({
    "subscription.canceledAt": { $gte: start, $lte: now },
    "subscription.plan": { $in: ["silver", "gold", "platinum"] },
  });

  // Estimar base ativa no início do período: usuários com assinatura que cobria o início
  const activeStartCount = await User.countDocuments({
    "subscription.plan": { $in: ["silver", "gold", "platinum"] },
    $or: [
      { "subscription.currentPeriodEnd": { $gte: start } },
      { "subscription.isActive": true },
    ],
  });

  const churnRate =
    activeStartCount === 0
      ? 0
      : Number((canceledCount / activeStartCount).toFixed(4));

  return { days, canceledCount, activeStartCount, churnRate };
}

async function calcCAC(spend = null, from = null, to = null) {
  if (!spend || !from || !to) {
    return {
      message:
        "Para calcular CAC forneça --spend e --from=YYYY-MM-DD --to=YYYY-MM-DD",
    };
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  // Contar novos clientes pagantes (usuários criados no período que já tem plano pago)
  const newPaying = await User.countDocuments({
    createdAt: { $gte: fromDate, $lte: toDate },
    "subscription.plan": { $in: ["silver", "gold", "platinum"] },
  });

  const cac =
    newPaying === 0 ? null : Number((Number(spend) / newPaying).toFixed(2));

  return { from: fromDate, to: toDate, spend: Number(spend), newPaying, cac };
}

async function main() {
  const args = parseArgs();
  const months = Number(args.months || 3);
  const days = Number(args.days || 30);
  const spend = args.spend ? Number(args.spend) : null;
  const from = args.from || null;
  const to = args.to || null;

  console.log("Conectando ao MongoDB...");
  await connectDB();

  console.log("Calculando MRR...");
  const mrr = await calcMRR();

  console.log(`Calculando receita dos últimos ${months} meses...`);
  const monthly = await calcMonthlyRevenue(months);

  console.log(`Calculando churn (${days} dias)...`);
  const churn = await calcChurn(days);

  console.log("Calculando CAC (se parâmetros fornecidos)...");
  const cac = await calcCAC(spend, from, to);

  const output = { generatedAt: new Date(), mrr, monthly, churn, cac };

  console.log(JSON.stringify(output, null, 2));

  process.exit(0);
}

main().catch((err) => {
  console.error("Erro ao calcular métricas:", err);
  process.exit(1);
});
