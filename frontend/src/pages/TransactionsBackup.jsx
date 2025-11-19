import React from "react";
import { Box, Typography } from "@mui/material";

export default function Transactions() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Transações (Versão Simplificada)</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Esta é uma versão temporária enquanto resolvemos os problemas de
        importação.
      </Typography>
    </Box>
  );
}
