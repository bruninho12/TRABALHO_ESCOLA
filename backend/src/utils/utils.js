/**
 * Utilitários gerais do projeto
 */

// Validar email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validar força de senha
const validatePassword = (password) => {
  // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Sanitizar input (remover espaços extras)
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return input.trim();
  }
  return input;
};

// Gerar token aleatório
const generateToken = (length = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Formatar moeda (BRL)
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Paginação
const getPaginationInfo = (page = 1, limit = 10, total = 0) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const pages = Math.ceil(total / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    skip,
    total,
    pages,
    hasMore: pageNum < pages,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  generateToken,
  formatCurrency,
  getPaginationInfo,
};
