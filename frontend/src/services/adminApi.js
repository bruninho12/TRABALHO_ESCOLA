/**
 * Serviço de API para o Painel Administrativo
 */

import api from "./api";

class AdminApi {
  // ===================== DASHBOARD =====================

  /**
   * Obter estatísticas gerais do dashboard
   */
  async getDashboardStats() {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas do dashboard:", error);
      throw this.handleError(error);
    }
  }

  // ===================== GESTÃO DE USUÁRIOS =====================

  /**
   * Listar usuários com filtros e paginação
   */
  async getUsers(params = {}) {
    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter detalhes de um usuário específico
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Atualizar dados de usuário
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Bloquear/Desbloquear usuário
   */
  async toggleUserBlock(userId, data = {}) {
    try {
      const response = await api.post(
        `/admin/users/${userId}/toggle-block`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao bloquear/desbloquear usuário:", error);
      throw this.handleError(error);
    }
  }

  // ===================== RELATÓRIOS FINANCEIROS =====================

  /**
   * Obter relatório financeiro detalhado
   */
  async getFinancialReport(params = {}) {
    try {
      const response = await api.get("/admin/reports/financial", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      throw this.handleError(error);
    }
  }

  // ===================== LOGS E AUDITORIA =====================

  /**
   * Obter logs de ações administrativas
   */
  async getAdminLogs(params = {}) {
    try {
      const response = await api.get("/admin/logs/admin-actions", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter logs de auditoria:", error);
      throw this.handleError(error);
    }
  }

  // ===================== SISTEMA =====================

  /**
   * Verificar saúde do sistema
   */
  async getSystemHealth() {
    try {
      const response = await api.get("/admin/system/health");
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar saúde do sistema:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Obter estatísticas detalhadas do sistema
   */
  async getSystemStats() {
    try {
      const response = await api.get("/admin/system/stats");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas do sistema:", error);
      throw this.handleError(error);
    }
  }

  // ===================== EXPORTAÇÃO =====================

  /**
   * Exportar dados de usuários
   */
  async exportUsers(format = "json", filters = {}) {
    try {
      const response = await api.post("/admin/export/users", {
        format,
        filters,
      });

      if (format === "csv") {
        // Para downloads de CSV, o backend retorna o arquivo
        return response;
      } else {
        // Para JSON, retorna os dados
        return response.data;
      }
    } catch (error) {
      console.error("Erro ao exportar usuários:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Baixar arquivo de exportação CSV
   */
  async downloadUsersCSV(filters = {}) {
    try {
      const response = await api.post(
        "/admin/export/users",
        {
          format: "csv",
          filters,
        },
        {
          responseType: "blob",
        }
      );

      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Erro ao baixar CSV de usuários:", error);
      throw this.handleError(error);
    }
  }

  // ===================== UTILITÁRIOS =====================

  /**
   * Tratar erros da API
   */
  handleError(error) {
    if (error.response) {
      // Erro com resposta do servidor
      const { status, data } = error.response;

      switch (status) {
        case 401:
          return new Error("Acesso não autorizado. Faça login novamente.");
        case 403:
          return new Error("Você não tem permissão para esta ação.");
        case 404:
          return new Error("Recurso não encontrado.");
        case 429:
          return new Error(
            "Muitas tentativas. Tente novamente em alguns minutos."
          );
        case 500:
          return new Error(
            "Erro interno do servidor. Tente novamente mais tarde."
          );
        default:
          return new Error(data?.error || data?.message || "Erro desconhecido");
      }
    } else if (error.request) {
      // Erro de rede
      return new Error("Erro de conexão. Verifique sua internet.");
    } else {
      // Outros erros
      return new Error(error.message || "Erro inesperado");
    }
  }

  /**
   * Verificar se o usuário tem permissões de admin
   */
  hasAdminPermission(user) {
    return (
      user?.isAdmin === true ||
      user?.role === "admin" ||
      user?.role === "super_admin"
    );
  }

  /**
   * Verificar nível de admin
   */
  getAdminLevel(user) {
    if (!user) return 0;

    switch (user.role) {
      case "super_admin":
        return 3;
      case "admin":
        return 2;
      default:
        return user.isAdmin ? 1 : 0;
    }
  }

  /**
   * Formatar dados para exibição
   */
  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  /**
   * Formatar data
   */
  formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  /**
   * Formatar porcentagem
   */
  formatPercentage(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  }
}

// Exportar instância única
export const adminApi = new AdminApi();
export default adminApi;
