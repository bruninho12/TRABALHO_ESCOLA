/**
 * Utilitário para validar valores de progresso em componentes LinearProgress
 * Garante que valores sejam sempre números válidos entre 0 e 100
 */

/**
 * Valida e normaliza um valor para uso em LinearProgress
 * @param {any} value - Valor a ser validado
 * @returns {number} - Número entre 0 e 100
 */
export const validateProgressValue = (value) => {
  // Converte para número
  const numValue = Number(value);

  // Verifica se é um número válido
  if (isNaN(numValue) || !isFinite(numValue)) {
    return 0;
  }

  // Garante que esteja entre 0 e 100
  return Math.min(Math.max(numValue, 0), 100);
};

/**
 * Calcula porcentagem segura com proteção contra divisão por zero
 * @param {number} current - Valor atual
 * @param {number} total - Valor total
 * @returns {number} - Porcentagem entre 0 e 100
 */
export const safePercentage = (current, total) => {
  if (!total || total <= 0) return 0;

  const percentage = (current / total) * 100;
  return validateProgressValue(percentage);
};

/**
 * Calcula progresso de experiência com proteção
 * @param {number} currentExp - Experiência atual
 * @param {number} nextLevelExp - Experiência necessária para próximo nível
 * @returns {number} - Progresso em porcentagem (0-100)
 */
export const safeExpProgress = (currentExp, nextLevelExp) => {
  return safePercentage(currentExp || 0, nextLevelExp || 1000);
};

/**
 * Calcula progresso de vida/mana com proteção
 * @param {number} current - Valor atual (vida/mana)
 * @param {number} max - Valor máximo
 * @returns {number} - Progresso em porcentagem (0-100)
 */
export const safeHealthProgress = (current, max) => {
  return safePercentage(current || 0, max || 100);
};

/**
 * Calcula progresso de quest com proteção
 * @param {number} progress - Progresso atual
 * @param {number} maxProgress - Progresso máximo
 * @returns {number} - Progresso em porcentagem (0-100)
 */
export const safeQuestProgress = (progress, maxProgress) => {
  return safePercentage(progress || 0, maxProgress || 1);
};
