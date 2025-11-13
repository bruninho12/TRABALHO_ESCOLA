/**
 * Formata um número para moeda (BRL)
 * @param {number} value - Valor a ser formatado
 * @param {boolean} showCents - Se deve mostrar os centavos
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, showCents = true) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });

  return formatter.format(value || 0);
};

/**
 * Formata uma data
 * @param {string|Date} date - Data a ser formatada
 * @param {string} format - Formato desejado ('display', 'input', 'api')
 * @returns {string} Data formatada
 */
export const formatDate = (date, format = "display") => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  switch (format) {
    case "display":
      return `${day}/${month}/${year}`;
    case "input":
    case "api":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Calcula a variação percentual entre dois valores
 * @param {number} oldValue - Valor antigo
 * @param {number} newValue - Valor novo
 * @returns {string} Variação percentual formatada
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? "+100%" : "0%";

  const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

/**
 * Obtém o nome do mês
 * @param {number} monthIndex - Índice do mês (0-11)
 * @param {boolean} short - Se deve retornar a versão curta
 * @returns {string} Nome do mês
 */
export const getMonthName = (monthIndex, short = false) => {
  const months = [
    { short: "Jan", long: "Janeiro" },
    { short: "Fev", long: "Fevereiro" },
    { short: "Mar", long: "Março" },
    { short: "Abr", long: "Abril" },
    { short: "Mai", long: "Maio" },
    { short: "Jun", long: "Junho" },
    { short: "Jul", long: "Julho" },
    { short: "Ago", long: "Agosto" },
    { short: "Set", long: "Setembro" },
    { short: "Out", long: "Outubro" },
    { short: "Nov", long: "Novembro" },
    { short: "Dez", long: "Dezembro" },
  ];

  if (monthIndex < 0 || monthIndex > 11) return "";

  return short ? months[monthIndex].short : months[monthIndex].long;
};

/**
 * Obtém o período atual
 * @returns {Object} Objeto com datas de início e fim do mês atual
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: formatDate(start, "input"),
    end: formatDate(end, "input"),
  };
};
