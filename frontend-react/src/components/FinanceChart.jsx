/**
 * FinanceChart - Componente de gráficos financeiros
 * Exibe múltiplas visualizações de dados financeiros
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  ButtonGroup,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
];

const FinanceChart = ({ data = {}, title = "Gráfico Financeiro" }) => {
  const [chartType, setChartType] = useState("line");
  const [period, setPeriod] = useState("month");

  // Dados de exemplo (em produção viriam da API)
  const sampleLineData = [
    { name: "Jan", receita: 4000, despesa: 2400, lucro: 1600 },
    { name: "Fev", receita: 3000, despesa: 1398, lucro: 1602 },
    { name: "Mar", receita: 2000, despesa: 9800, lucro: -7800 },
    { name: "Abr", receita: 2780, despesa: 3908, lucro: -1128 },
    { name: "Mai", receita: 1890, despesa: 4800, lucro: -2910 },
    { name: "Jun", receita: 2390, despesa: 3800, lucro: -1410 },
    { name: "Jul", receita: 3490, despesa: 4300, lucro: -810 },
  ];

  const samplePieData = [
    { name: "Alimentação", value: 35 },
    { name: "Transporte", value: 20 },
    { name: "Diversão", value: 15 },
    { name: "Saúde", value: 15 },
    { name: "Outros", value: 15 },
  ];

  const sampleBarData = [
    { name: "Semana 1", vendas: 4000, lucro: 2400 },
    { name: "Semana 2", vendas: 3000, lucro: 1398 },
    { name: "Semana 3", vendas: 2000, lucro: 9800 },
    { name: "Semana 4", vendas: 2780, lucro: 3908 },
  ];

  const chartData = data.lineData || sampleLineData;
  const pieData = data.pieData || samplePieData;
  const barData = data.barData || sampleBarData;

  return (
    <Card>
      <CardHeader
        title={title}
        subheader="Análise Financeira"
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={period}
                label="Período"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="week">Semanal</MenuItem>
                <MenuItem value="month">Mensal</MenuItem>
                <MenuItem value="quarter">Trimestral</MenuItem>
                <MenuItem value="year">Anual</MenuItem>
              </Select>
            </FormControl>

            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setChartType("line")}
                variant={chartType === "line" ? "contained" : "outlined"}
              >
                Linha
              </Button>
              <Button
                onClick={() => setChartType("bar")}
                variant={chartType === "bar" ? "contained" : "outlined"}
              >
                Barras
              </Button>
              <Button
                onClick={() => setChartType("pie")}
                variant={chartType === "pie" ? "contained" : "outlined"}
              >
                Pizza
              </Button>
              <Button
                onClick={() => setChartType("area")}
                variant={chartType === "area" ? "contained" : "outlined"}
              >
                Área
              </Button>
            </ButtonGroup>
          </Box>
        }
      />

      <Divider />

      <CardContent>
        {/* Gráfico de Linha */}
        {chartType === "line" && (
          <Box sx={{ height: 400, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#66BB6A"
                  strokeWidth={2}
                  dot={{ fill: "#66BB6A", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Receita"
                />
                <Line
                  type="monotone"
                  dataKey="despesa"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  dot={{ fill: "#FF6B6B", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Despesa"
                />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="#4ECDC4"
                  strokeWidth={2}
                  dot={{ fill: "#4ECDC4", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Lucro/Prejuízo"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Gráfico de Barras */}
        {chartType === "bar" && (
          <Box sx={{ height: 400, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                />
                <Legend />
                <Bar dataKey="vendas" fill="#4ECDC4" name="Vendas" />
                <Bar dataKey="lucro" fill="#66BB6A" name="Lucro" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Gráfico de Pizza */}
        {chartType === "pie" && (
          <Box sx={{ height: 400, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Gráfico de Área */}
        {chartType === "area" && (
          <Box sx={{ height: 400, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="receita"
                  fill="#66BB6A"
                  stroke="#66BB6A"
                  fillOpacity={0.6}
                  name="Receita"
                />
                <Area
                  type="monotone"
                  dataKey="despesa"
                  fill="#FF6B6B"
                  stroke="#FF6B6B"
                  fillOpacity={0.4}
                  name="Despesa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Resumo Estatístico */}
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumo do Período
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", background: "#e8f5e9" }}>
              <Typography variant="caption" color="text.secondary">
                Total Receita
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#66BB6A", fontWeight: 600 }}
              >
                R$ 20.150
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", background: "#ffebee" }}>
              <Typography variant="caption" color="text.secondary">
                Total Despesa
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#FF6B6B", fontWeight: 600 }}
              >
                R$ 30.206
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", background: "#e0f2f1" }}>
              <Typography variant="caption" color="text.secondary">
                Saldo
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#4ECDC4", fontWeight: 600 }}
              >
                -R$ 10.056
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", background: "#fff3e0" }}>
              <Typography variant="caption" color="text.secondary">
                Taxa de Poupança
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#FFA726", fontWeight: 600 }}
              >
                -49.9%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FinanceChart;
