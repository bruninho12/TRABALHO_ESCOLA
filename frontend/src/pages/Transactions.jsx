import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  Divider,
  Stack,
  Avatar,
  LinearProgress,
  Badge,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  DateRange as DateIcon,
  MoreVert as MoreIcon,
  FileDownload as ExportIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  format,
  parseISO,
  isWithinInterval,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TransactionForm } from "../components/TransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import Swal from "sweetalert2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

export default function Transactions() {
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();
  const { categories } = useCategories();

  // Estados para UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filtros aplicados
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = transactions.filter((transaction) => {
      // Busca por texto
      if (
        searchTerm &&
        !transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtro por categoria
      if (filterCategory && transaction.category !== filterCategory) {
        return false;
      }

      // Filtro por tipo
      if (filterType !== "all") {
        const isExpense = transaction.amount < 0;
        if (filterType === "expense" && !isExpense) return false;
        if (filterType === "income" && isExpense) return false;
      }

      // Filtro por data
      if (filterDate !== "all") {
        const transactionDate = parseISO(transaction.date);
        const now = new Date();

        switch (filterDate) {
          case "today":
            if (
              !isWithinInterval(transactionDate, {
                start: startOfMonth(now),
                end: endOfMonth(now),
              })
            )
              return false;
            break;
          case "week":
            if (
              !isWithinInterval(transactionDate, {
                start: subDays(now, 7),
                end: now,
              })
            )
              return false;
            break;
          case "month":
            if (
              !isWithinInterval(transactionDate, {
                start: startOfMonth(now),
                end: endOfMonth(now),
              })
            )
              return false;
            break;
          default:
            break;
        }
      }

      return true;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === "amount") {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    transactions,
    searchTerm,
    filterCategory,
    filterType,
    filterDate,
    sortBy,
    sortOrder,
  ]);

  // Estatísticas
  const statistics = useMemo(() => {
    if (!filteredTransactions.length)
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
      };

    const totalIncome = filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(
      filteredTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    if (!filteredTransactions.length || !categories.length) return null;

    const expensesByCategory = {};
    const incomesByCategory = {};

    filteredTransactions.forEach((transaction) => {
      const category = categories.find(
        (c) => c.id === transaction.category || c._id === transaction.category
      );
      const categoryName = category?.name || "Sem categoria";

      if (transaction.amount < 0) {
        expensesByCategory[categoryName] =
          (expensesByCategory[categoryName] || 0) +
          Math.abs(transaction.amount);
      } else {
        incomesByCategory[categoryName] =
          (incomesByCategory[categoryName] || 0) + transaction.amount;
      }
    });

    return {
      expensesByCategory,
      incomesByCategory,
      categoryLabels: [
        ...new Set([
          ...Object.keys(expensesByCategory),
          ...Object.keys(incomesByCategory),
        ]),
      ],
      expenseData: Object.values(expensesByCategory),
      incomeData: Object.values(incomesByCategory),
    };
  }, [filteredTransactions, categories]);

  // Handlers
  const handleCreateTransaction = useCallback(
    async (transactionData) => {
      try {
        await createTransaction(transactionData);
        setShowForm(false);
        Swal.fire({
          icon: "success",
          title: "Transação criada!",
          text: "A transação foi adicionada com sucesso.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível criar a transação.",
        });
      }
    },
    [createTransaction]
  );

  const handleUpdateTransaction = useCallback(
    async (transactionData) => {
      try {
        await updateTransaction(
          editingTransaction.id || editingTransaction._id,
          transactionData
        );
        setEditingTransaction(null);
        Swal.fire({
          icon: "success",
          title: "Transação atualizada!",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível atualizar a transação.",
        });
      }
    },
    [updateTransaction, editingTransaction]
  );

  const handleDeleteTransaction = useCallback(
    async (transaction) => {
      const result = await Swal.fire({
        title: "Confirmar exclusão",
        text: `Deseja excluir a transação "${transaction.description}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await deleteTransaction(transaction.id || transaction._id);
          Swal.fire({
            icon: "success",
            title: "Transação excluída!",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Não foi possível excluir a transação.",
          });
        }
      }
    },
    [deleteTransaction]
  );

  const handleExportCSV = useCallback(() => {
    if (!filteredTransactions.length) return;

    const csvContent = [
      ["Data", "Descrição", "Valor", "Categoria", "Tipo"].join(","),
      ...filteredTransactions.map((t) => {
        const category = categories.find(
          (c) => c.id === t.category || c._id === t.category
        );
        return [
          format(parseISO(t.date), "dd/MM/yyyy"),
          `"${t.description}"`,
          t.amount.toFixed(2),
          category?.name || "Sem categoria",
          t.amount > 0 ? "Receita" : "Despesa",
        ].join(",");
      }),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  }, [filteredTransactions, categories]);

  const getCategoryName = useCallback(
    (categoryId) => {
      const category = categories.find(
        (c) => c.id === categoryId || c._id === categoryId
      );
      return category?.name || "Sem categoria";
    },
    [categories]
  );

  const getCategoryColor = useCallback(
    (categoryId) => {
      const category = categories.find(
        (c) => c.id === categoryId || c._id === categoryId
      );
      return category?.color || "#9e9e9e";
    },
    [categories]
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar transações: {error.message}
        </Alert>
        <Button
          variant="contained"
          onClick={refreshTransactions}
          startIcon={<RefreshIcon />}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
              gutterBottom
            >
              💳 Transações
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas receitas e despesas de forma inteligente
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Tooltip title="Análise de dados">
              <IconButton
                onClick={() => setShowAnalytics(true)}
                color="primary"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                !filteredTransactions.length
                  ? "Nenhuma transação para exportar"
                  : "Exportar CSV"
              }
            >
              <span>
                <IconButton
                  onClick={handleExportCSV}
                  disabled={!filteredTransactions.length}
                >
                  <ExportIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{ borderRadius: 2 }}
            >
              Nova Transação
            </Button>
          </Stack>
        </Box>
      </motion.div>

      {/* Cards de Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Receitas
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        `R$ ${statistics.totalIncome.toFixed(2)}`
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <TrendingDownIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Despesas
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        `R$ ${statistics.totalExpenses.toFixed(2)}`
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${
                  statistics.balance >= 0
                    ? "#4facfe 0%, #00f2fe 100%"
                    : "#fa709a 0%, #fee140 100%"
                })`,
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <MoneyIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Saldo
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {loading ? (
                        <Skeleton width={80} />
                      ) : (
                        `R$ ${statistics.balance.toFixed(2)}`
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                color: "text.primary",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
                    <Badge
                      badgeContent={statistics.transactionCount}
                      color="error"
                    >
                      <CategoryIcon />
                    </Badge>
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2">Total de Transações</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {loading ? (
                        <Skeleton width={40} />
                      ) : (
                        statistics.transactionCount
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card elevation={1} sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Categoria"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {categories.map((category) => (
                      <MenuItem
                        key={category.id || category._id}
                        value={category.id || category._id}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={filterType}
                    label="Tipo"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="income">Receitas</MenuItem>
                    <MenuItem value="expense">Despesas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={filterDate}
                    label="Período"
                    onChange={(e) => setFilterDate(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="today">Hoje</MenuItem>
                    <MenuItem value="week">Última semana</MenuItem>
                    <MenuItem value="month">Este mês</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Stack direction="row" spacing={1}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="date">Data</MenuItem>
                      <MenuItem value="amount">Valor</MenuItem>
                      <MenuItem value="description">Descrição</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Ordem</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Ordem"
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <MenuItem value="desc">Desc</MenuItem>
                      <MenuItem value="asc">Asc</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <Box mb={3}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {/* Tabela de Transações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Valor
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={150} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          📝 Nenhuma transação encontrada
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ||
                          filterCategory ||
                          filterType !== "all" ||
                          filterDate !== "all"
                            ? "Tente ajustar os filtros ou criar uma nova transação."
                            : "Comece criando sua primeira transação!"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((transaction, index) => (
                        <motion.tr
                          key={transaction.id || transaction._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          component={TableRow}
                          sx={{
                            "&:hover": { bgcolor: "grey.50" },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {format(
                                parseISO(transaction.date),
                                "dd/MM/yyyy",
                                { locale: ptBR }
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {format(parseISO(transaction.date), "EEEE", {
                                locale: ptBR,
                              })}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body1" fontWeight={600}>
                              {transaction.description}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={getCategoryName(transaction.category)}
                              size="small"
                              sx={{
                                bgcolor: `${getCategoryColor(
                                  transaction.category
                                )}20`,
                                color: getCategoryColor(transaction.category),
                                border: `1px solid ${getCategoryColor(
                                  transaction.category
                                )}40`,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color={
                                transaction.amount > 0
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {transaction.amount > 0 ? "+" : ""}R${" "}
                              {Math.abs(transaction.amount).toFixed(2)}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedTransaction(transaction);
                              }}
                            >
                              <MoreIcon />
                            </IconButton>
                          </TableCell>
                        </motion.tr>
                      ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>

          {filteredTransactions.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          )}
        </Card>
      </motion.div>

      {/* FAB para Nova Transação (Mobile) */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
        }}
        onClick={() => setShowForm(true)}
      >
        <AddIcon />
      </Fab>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2, minWidth: 120 },
        }}
      >
        <MenuItemComponent
          onClick={() => {
            setEditingTransaction(selectedTransaction);
            setAnchorEl(null);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItemComponent>
        <MenuItemComponent
          onClick={() => {
            handleDeleteTransaction(selectedTransaction);
            setAnchorEl(null);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItemComponent>
      </Menu>

      {/* Modal de Formulário */}
      <TransactionForm
        open={showForm || Boolean(editingTransaction)}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={
          editingTransaction ? handleUpdateTransaction : handleCreateTransaction
        }
        initialData={editingTransaction}
      />

      {/* Modal de Análise */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            📊 Análise de Gastos
          </Typography>
        </DialogTitle>
        <DialogContent>
          {chartData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Despesas por Categoria
                </Typography>
                <Doughnut
                  data={{
                    labels: Object.keys(chartData.expensesByCategory),
                    datasets: [
                      {
                        data: Object.values(chartData.expensesByCategory),
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Receitas vs Despesas
                </Typography>
                <Bar
                  data={{
                    labels: ["Receitas", "Despesas"],
                    datasets: [
                      {
                        data: [
                          statistics.totalIncome,
                          statistics.totalExpenses,
                        ],
                        backgroundColor: ["#4CAF50", "#F44336"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalytics(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
