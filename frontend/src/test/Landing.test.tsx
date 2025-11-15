import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { describe, it, expect } from "vitest";
import { lightTheme } from "../styles/theme";
import Landing from "../pages/Landing";

// Wrapper para testes com providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </BrowserRouter>
);

describe("Landing Page", () => {
  it("deve renderizar o título principal", () => {
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    expect(
      screen.getByText(/Controle financeiro gamificado/i)
    ).toBeInTheDocument();
  });

  it("deve ter botões de ação", () => {
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    expect(
      screen.getByRole("button", { name: /Começar Grátis/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("deve exibir seção de vantagens", () => {
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    expect(screen.getByText(/IA que trabalha por você/i)).toBeInTheDocument();
    expect(screen.getByText(/Gamificação que engaja/i)).toBeInTheDocument();
    expect(screen.getByText(/Score financeiro acionável/i)).toBeInTheDocument();
  });

  it("deve ter links para documentação", () => {
    render(
      <TestWrapper>
        <Landing />
      </TestWrapper>
    );

    const githubLink = screen.getByRole("button", { name: /GitHub/i });
    const swaggerLink = screen.getByRole("button", { name: /Swagger/i });

    expect(githubLink).toBeInTheDocument();
    expect(swaggerLink).toBeInTheDocument();
  });
});
