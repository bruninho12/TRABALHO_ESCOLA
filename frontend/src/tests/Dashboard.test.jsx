import {
  getTransactions,
  getMonthlyStatistics,
} from "@services/transactionService";
import { getUserGoals } from "@services/goalService";
// ==========================================
// 🧪 Exemplo de Teste - Dashboard Component
// Demonstração de testes unitários com Vitest
// ==========================================
/* eslint-env node */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, mockTransactions } from "@tests/utils/testUtils";
import Dashboard from "@pages/Dashboard";

// Mock dos serviços
vi.mock("@services/transactionService", () => ({
  getTransactions: vi.fn(),
  getMonthlyStatistics: vi.fn(),
  getRecentTransactions: vi.fn(),
}));

vi.mock("@services/goalService", () => ({
  getUserGoals: vi.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Reset mocks antes de cada teste
    vi.clearAllMocks();

    // Mock das APIs já importados no topo

    getTransactions.mockResolvedValue({
      data: { transactions: mockTransactions },
    });

    getMonthlyStatistics.mockResolvedValue({
      data: {
        totalIncome: 5000,
        totalExpenses: 370.5,
        balance: 4629.5,
        transactionCount: 3,
      },
    });

    getUserGoals.mockResolvedValue({
      data: { goals: [] },
    });
  });

  it("deve renderizar o dashboard corretamente", async () => {
    renderWithProviders(<Dashboard />);

    // Verificar se elementos principais estão presentes
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/saldo atual/i)).toBeInTheDocument();
    expect(screen.getByText(/receitas/i)).toBeInTheDocument();
    expect(screen.getByText(/despesas/i)).toBeInTheDocument();
  });

  it("deve exibir loading enquanto carrega dados", () => {
    renderWithProviders(<Dashboard />);

    // Verificar se componente de loading está presente
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("deve exibir estatísticas financeiras após carregar", async () => {
    renderWithProviders(<Dashboard />);

    // Aguardar carregamento dos dados
    await screen.findByText(/R\\$ 5\\.000,00/);

    // Verificar se valores estão corretos
    expect(screen.getByText(/R\\$ 5\\.000,00/)).toBeInTheDocument(); // Receitas
    expect(screen.getByText(/R\\$ 370,50/)).toBeInTheDocument(); // Despesas
    expect(screen.getByText(/R\\$ 4\\.629,50/)).toBeInTheDocument(); // Saldo
  });

  it("deve navegar para página de transações ao clicar no botão", async () => {
    renderWithProviders(<Dashboard />);

    await screen.findByText(/ver todas as transações/i);

    const viewAllButton = screen.getByRole("button", {
      name: /ver todas as transações/i,
    });

    fireEvent.click(viewAllButton);

    // Verificar se navegação foi chamada (mock do useNavigate)
    // Implementação específica dependeria do setup do React Router
  });

  it("deve exibir mensagem de erro quando falha ao carregar dados", async () => {
    // Mock de erro na API
    getTransactions.mockRejectedValue(new Error("Erro na API"));

    renderWithProviders(<Dashboard />);

    // Aguardar mensagem de erro
    await screen.findByText(/erro ao carregar dados/i);

    expect(screen.getByText(/erro ao carregar dados/i)).toBeInTheDocument();
  });

  it("deve atualizar dados quando período é alterado", async () => {
    renderWithProviders(<Dashboard />);

    await screen.findByText(/últimos 30 dias/i);

    // Simular mudança de período
    const periodSelect = screen.getByRole("combobox");
    fireEvent.change(periodSelect, { target: { value: "7days" } });

    // Verificar se nova requisição foi feita
    expect(getMonthlyStatistics).toHaveBeenCalledWith("7days");
  });

  it("deve ser acessível via teclado", async () => {
    renderWithProviders(<Dashboard />);

    await screen.findByText(/dashboard/i);

    // Verificar se elementos podem ser focados via Tab
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeVisible();
      expect(button).not.toHaveAttribute("tabIndex", "-1");
    });
  });

  it("deve ter estrutura semântica correta", async () => {
    renderWithProviders(<Dashboard />);

    // Verificar landmarks ARIA
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /menu principal/i })
    ).toBeInTheDocument();

    // Verificar headings hierárquicos
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
