/**
 * @fileoverview Componente PricingDialog
 * Modal reutilizável para seleção e upgrade de plano
 */

import React from "react";
import Swal from "sweetalert2";

/**
 * Exibe modal de upgrade de plano com opções: Premium, Anual, Vitalício
 * @param {Function} onSelectPlan - Callback ao selecionar um plano (recebe valor: 'premium' | 'anual' | 'vitalicio')
 * @param {Object} options - Opções customizáveis
 * @returns {Promise<boolean>} true se selecionou um plano, false se cancelou
 */
export async function showPricingDialog(onSelectPlan, options = {}) {
  const defaultOptions = {
    title: "Escolha seu plano",
    message: "Desbloqueie recursos premium e transações ilimitadas",
    showCancelButton: true,
    cancelButtonText: "Continuar grátis",
  };

  const finalOptions = { ...defaultOptions, ...options };

  const { value, isConfirmed, isDismissed } = await Swal.fire({
    title: finalOptions.title,
    html:
      `<div style="text-align:left">` +
      `<p style="margin-bottom:16px; font-size:0.95rem">${finalOptions.message}</p>` +
      `</div>`,
    input: "radio",
    inputOptions: {
      premium: "💎 Premium — R$ 4,90/mês",
      anual: "📅 Anual — R$ 39,90/ano (32% de desconto)",
      vitalicio: "⭐ Vitalício — R$ 79,90 (pague uma vez)",
    },
    inputValidator: (v) => (!v ? "Selecione uma opção ou Cancelar" : undefined),
    confirmButtonText: "Escolher plano",
    showCancelButton: finalOptions.showCancelButton,
    cancelButtonText: finalOptions.cancelButtonText,
    focusConfirm: false,
  });

  if (isConfirmed && value) {
    if (onSelectPlan) {
      onSelectPlan(value);
    }
    return true;
  }

  if (isDismissed) {
    return false;
  }

  return false;
}

/**
 * Confirma sucesso de upgrade
 */
export async function showPlanSuccessDialog() {
  await Swal.fire({
    icon: "success",
    title: "Plano ativado! 🎉",
    html:
      `<p style="margin-bottom:8px">Você agora tem acesso a:</p>` +
      `<ul style="text-align:left; display:inline-block">` +
      `<li>✓ Transações ilimitadas</li>` +
      `<li>✓ Metas avançadas</li>` +
      `<li>✓ Exportações completas</li>` +
      `<li>✓ Avatares premium</li>` +
      `</ul>`,
    timer: 1500,
    showConfirmButton: false,
  });
}

/**
 * Componente wrapper para uso em React
 */
export function usePricingDialog() {
  return { showPricingDialog, showPlanSuccessDialog };
}

export default showPricingDialog;
