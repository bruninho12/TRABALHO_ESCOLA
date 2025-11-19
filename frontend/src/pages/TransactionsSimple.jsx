import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export default function Transactions() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        💳 Transações
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gerencie suas receitas e despesas
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => alert("Funcionalidade em desenvolvimento")}
      >
        Nova Transação
      </Button>

      <Typography
        variant="body2"
        sx={{
          mt: 4,
          p: 2,
          bgcolor: "info.main",
          color: "white",
          borderRadius: 1,
        }}
      >
        📝 Componente em manutenção - versão simplificada carregada com sucesso
      </Typography>
    </Box>
  );
}
