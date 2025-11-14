import React, { useState } from "react";
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
} from "@mui/material";

export function CategoryForm({ open, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      type: "expense",
      color: "#000000",
    }
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
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Editar Categoria" : "Nova Categoria"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo"
              required
            >
              <MenuItem value="expense">Despesa</MenuItem>
              <MenuItem value="income">Receita</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            fullWidth
            label="Cor"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
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
