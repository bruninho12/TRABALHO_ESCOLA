import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Mock do API
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      headers: {
        authorization: "",
      },
    },
  },
}));

// Componente de teste para usar o hook
const TestComponent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <span data-testid="authenticated">
        {isAuthenticated ? "true" : "false"}
      </span>
      <span data-testid="user">{user?.name || "no user"}</span>
    </div>
  );
};

describe("AuthContext", () => {
  it("deve inicializar com loading true", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId("loading")).toHaveTextContent("true");
    expect(getByTestId("authenticated")).toHaveTextContent("false");
    expect(getByTestId("user")).toHaveTextContent("no user");
  });

  it("deve fornecer métodos de autenticação", () => {
    const TestAuthMethods = () => {
      const { login, logout, register } = useAuth();
      return (
        <div>
          <button onClick={() => login("test@test.com", "password")}>
            Login
          </button>
          <button onClick={logout}>Logout</button>
          <button
            onClick={() =>
              register("Test", "test@test.com", "password", "password")
            }
          >
            Register
          </button>
        </div>
      );
    };

    const { getByText } = render(
      <AuthProvider>
        <TestAuthMethods />
      </AuthProvider>
    );

    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Logout")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });
});
