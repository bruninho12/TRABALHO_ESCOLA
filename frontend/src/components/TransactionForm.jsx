import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useCategories } from "../hooks/useCategories";

export function TransactionForm({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { categories, isLoading } = useCategories();
  const [formData, setFormData] = useState(
    initialData || {
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      type: "expense",
    }
  );

  // Debug: log das categorias
  console.log("Categorias carregadas:", categories);
  console.log("Tipo de transação selecionado:", formData.type);
  console.log(
    "Categorias filtradas:",
    categories.filter((cat) => cat.type === formData.type)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount:
        formData.type === "expense"
          ? -Math.abs(Number(formData.amount))
          : Math.abs(Number(formData.amount)),
    });
    onClose();
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Editar Transação" : "Nova Transação"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Valor"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Data"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo"
            >
              <MenuItem value="expense">Despesa</MenuItem>
              <MenuItem value="income">Receita</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Categoria</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Categoria"
            >
              {categories &&
              Array.isArray(categories) &&
              categories.length > 0 ? (
                categories
                  .filter((cat) => cat.type === formData.type)
                  .map((category) => (
                    <MenuItem
                      key={category.id || category._id}
                      value={category.id || category._id}
                    >
                      {category.name}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem disabled>Nenhuma categoria disponível</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {initialData ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
