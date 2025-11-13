import { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionForm } from "../components/TransactionForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner as Loading } from "../components/Loading";

export default function Transactions() {
  // Hooks
  const {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  // Estados
  const [openForm, setOpenForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Typography color="error">
        Erro ao carregar transações: {error.message}
      </Typography>
    );
  }

  const handleCreate = (data) => {
    createTransaction(data);
    setOpenForm(false);
  };

  const handleUpdate = (data) => {
    if (selectedTransaction) {
      updateTransaction({ id: selectedTransaction.id, transaction: data });
      setOpenForm(false);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedTransaction(null);
    setOpenForm(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Transações</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nova Transação
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions && Array.isArray(transactions) ? (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id || transaction._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      transaction.type === "income"
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(244, 67, 54, 0.1)",
                  }}
                >
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        transaction.type === "income"
                          ? "success.main"
                          : "error.main",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(transaction)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(transaction)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">
                    Nenhuma transação encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TransactionForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={selectedTransaction ? handleUpdate : handleCreate}
        initialData={selectedTransaction}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      />
    </>
  );
}
