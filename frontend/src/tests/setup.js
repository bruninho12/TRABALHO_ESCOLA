/* eslint-env node */
import "@testing-library/jest-dom";
import { afterEach, vi, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock do IntersectionObserver
if (typeof global !== "undefined") {
  global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock do ResizeObserver
if (typeof global !== "undefined") {
  global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock do matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
if (typeof global !== "undefined") {
  global.localStorage = localStorageMock;
}

// Mock do Chart.js
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
    defaults: {
      font: {},
      color: {},
    },
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  ArcElement: vi.fn(),
  Filler: vi.fn(),
}));

// Configurar console para testes
const originalError = console.error;

if (typeof beforeAll !== "undefined") {
  beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
}

if (typeof afterAll !== "undefined") {
  afterAll(() => {
    console.error = originalError;
  });
}
