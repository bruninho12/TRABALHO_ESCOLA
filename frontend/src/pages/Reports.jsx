import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
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
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ReportsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [cashFlowData] = useState([]);
  const [expenseByCategoryData] = useState([]);
  const [monthlyBalanceData] = useState([]);

  const handleExportPDF = () => {
    alert("Exportar para PDF não está implementado ainda");
  };

  const handleExportCSV = () => {
    alert("Exportar para CSV não está implementado ainda");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          📊 Relatórios Financeiros
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportPDF}
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            CSV
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Fluxo de Caixa" />
        <Tab label="Despesas por Categoria" />
        <Tab label="Saldo Mensal" />
      </Tabs>

      {/* Fluxo de Caixa */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fluxo de Caixa - Últimos 12 Meses
          </Typography>
          {cashFlowData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00C49F"
                  name="Receita"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#FF8042"
                  name="Despesa"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#0088FE"
                  name="Saldo"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="textSecondary">
              Sem dados de fluxo de caixa
            </Typography>
          )}
        </Paper>
      )}

      {/* Despesas por Categoria */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distribuição de Despesas
              </Typography>
              {expenseByCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={expenseByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: R$ ${value.toFixed(2)}`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">
                  Sem dados de despesas
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Categorias
              </Typography>
              {expenseByCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={expenseByCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Valor (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">
                  Sem dados de categorias
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Saldo Mensal */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Evolução do Saldo Mensal
          </Typography>
          {monthlyBalanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyBalanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="balance" fill="#00C49F" name="Saldo (R$)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="textSecondary">Sem dados de saldo</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default ReportsPage;
