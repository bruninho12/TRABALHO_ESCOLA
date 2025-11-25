/**
 * @fileoverview ChartComponents - Componentes de gráficos otimizados
 * Implementa lazy loading e memoização para melhor performance
 */

import React, { memo, useMemo, lazy, Suspense } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Lazy loading dos componentes de gráfico
const Bar = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Bar }))
);
const Line = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Line }))
);
const Doughnut = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Doughnut }))
);
const Pie = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Pie }))
);

// Registrar componentes Chart.js uma vez
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Skeleton para loading dos gráficos
const ChartSkeleton = memo(({ height = 300, width = "100%" }) => (
  <Box sx={{ width, height, p: 2 }}>
    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={height - 60} />
  </Box>
));

// Cores padrão otimizadas
const CHART_COLORS = {
  primary: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
  secondary: ["#a8edea", "#fed6e3", "#ffecd2", "#fcb69f", "#ffeef8", "#d299c2"],
  gradients: {
    income: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    expense: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    balance: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
};

// Configurações padrão otimizadas
const DEFAULT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1f2937",
      bodyColor: "#374151",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      cornerRadius: 8,
      caretPadding: 10,
      displayColors: true,
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(context.parsed.y || context.parsed);
          return `${label}: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 11,
        },
        callback: function (value) {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
          }).format(value);
        },
      },
    },
  },
  animation: {
    duration: 1000,
    easing: "easeInOutQuart",
  },
};

// Componente de gráfico de barras otimizado
export const OptimizedBarChart = memo(
  ({ data, options = {}, height = 300, title, loading = false }) => {
    const chartData = useMemo(() => {
      if (!data) return null;

      return {
        ...data,
        datasets: data.datasets?.map((dataset, index) => ({
          ...dataset,
          backgroundColor:
            dataset.backgroundColor ||
            CHART_COLORS.primary[index % CHART_COLORS.primary.length],
          borderColor:
            dataset.borderColor ||
            CHART_COLORS.primary[index % CHART_COLORS.primary.length],
          borderWidth: dataset.borderWidth || 1,
          borderRadius: dataset.borderRadius || 4,
        })),
      };
    }, [data]);

    const chartOptions = useMemo(
      () => ({
        ...DEFAULT_OPTIONS,
        ...options,
        plugins: {
          ...DEFAULT_OPTIONS.plugins,
          ...options.plugins,
          title: title
            ? {
                display: true,
                text: title,
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1f2937",
                padding: 20,
              }
            : undefined,
        },
      }),
      [options, title]
    );

    if (loading) {
      return <ChartSkeleton height={height} />;
    }

    if (!chartData) {
      return (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Nenhum dado disponível</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, width: "100%" }}>
        <Suspense fallback={<ChartSkeleton height={height} />}>
          <Bar data={chartData} options={chartOptions} />
        </Suspense>
      </Box>
    );
  }
);

// Componente de gráfico de linha otimizado
export const OptimizedLineChart = memo(
  ({
    data,
    options = {},
    height = 300,
    title,
    loading = false,
    gradient = true,
  }) => {
    const chartData = useMemo(() => {
      if (!data) return null;

      return {
        ...data,
        datasets: data.datasets?.map((dataset, index) => ({
          ...dataset,
          backgroundColor: gradient
            ? (ctx) => {
                const canvas = ctx.chart.ctx;
                const chartArea = ctx.chart.chartArea;
                if (!chartArea) return dataset.backgroundColor;

                const gradientFill = canvas.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                const color =
                  dataset.borderColor ||
                  CHART_COLORS.primary[index % CHART_COLORS.primary.length];
                gradientFill.addColorStop(0, color + "20");
                gradientFill.addColorStop(1, color + "00");
                return gradientFill;
              }
            : dataset.backgroundColor,
          borderColor:
            dataset.borderColor ||
            CHART_COLORS.primary[index % CHART_COLORS.primary.length],
          borderWidth: dataset.borderWidth || 2,
          pointRadius: dataset.pointRadius || 4,
          pointHoverRadius: dataset.pointHoverRadius || 6,
          fill: gradient ? true : dataset.fill,
          tension: dataset.tension || 0.4,
        })),
      };
    }, [data, gradient]);

    const chartOptions = useMemo(
      () => ({
        ...DEFAULT_OPTIONS,
        ...options,
        plugins: {
          ...DEFAULT_OPTIONS.plugins,
          ...options.plugins,
          title: title
            ? {
                display: true,
                text: title,
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1f2937",
                padding: 20,
              }
            : undefined,
        },
      }),
      [options, title]
    );

    if (loading) {
      return <ChartSkeleton height={height} />;
    }

    if (!chartData) {
      return (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Nenhum dado disponível</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, width: "100%" }}>
        <Suspense fallback={<ChartSkeleton height={height} />}>
          <Line data={chartData} options={chartOptions} />
        </Suspense>
      </Box>
    );
  }
);

// Componente de gráfico de rosca otimizado
export const OptimizedDoughnutChart = memo(
  ({
    data,
    options = {},
    height = 300,
    title,
    loading = false,
    showValues = true,
  }) => {
    const chartData = useMemo(() => {
      if (!data) return null;

      return {
        ...data,
        datasets: data.datasets?.map((dataset) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || CHART_COLORS.primary,
          borderWidth: dataset.borderWidth || 2,
          borderColor: "#ffffff",
          hoverBorderWidth: dataset.hoverBorderWidth || 3,
        })),
      };
    }, [data]);

    const chartOptions = useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i];
                    const total = dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);

                    return {
                      text: showValues ? `${label} (${percentage}%)` : label,
                      fillStyle: dataset.backgroundColor[i],
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#1f2937",
            bodyColor: "#374151",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(context.parsed);
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
          title: title
            ? {
                display: true,
                text: title,
                font: {
                  size: 16,
                  weight: "bold",
                },
                color: "#1f2937",
                padding: 20,
              }
            : undefined,
        },
        ...options,
      }),
      [options, title, showValues]
    );

    if (loading) {
      return <ChartSkeleton height={height} />;
    }

    if (!chartData || !chartData.datasets?.[0]?.data?.length) {
      return (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Nenhum dado disponível</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height, width: "100%" }}>
        <Suspense fallback={<ChartSkeleton height={height} />}>
          <Doughnut data={chartData} options={chartOptions} />
        </Suspense>
      </Box>
    );
  }
);

// Adicionar displayNames para debugging
OptimizedBarChart.displayName = "OptimizedBarChart";
OptimizedLineChart.displayName = "OptimizedLineChart";
OptimizedDoughnutChart.displayName = "OptimizedDoughnutChart";
ChartSkeleton.displayName = "ChartSkeleton";

// Exportar cores e utilitários
export { CHART_COLORS, DEFAULT_OPTIONS };

// Hook para preparar dados de gráfico
export const useChartData = (rawData, type = "bar") => {
  return useMemo(() => {
    if (!rawData) return null;

    // Processar dados baseado no tipo de gráfico
    switch (type) {
      case "line":
        return {
          ...rawData,
          datasets: rawData.datasets?.map((dataset) => ({
            ...dataset,
            tension: 0.4,
            fill: true,
          })),
        };
      case "doughnut":
        return {
          ...rawData,
          datasets: rawData.datasets?.map((dataset) => ({
            ...dataset,
            borderWidth: 2,
            hoverBorderWidth: 3,
          })),
        };
      default:
        return rawData;
    }
  }, [rawData, type]);
};
