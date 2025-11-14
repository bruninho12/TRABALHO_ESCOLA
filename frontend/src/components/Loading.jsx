import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress />
      <Typography color="textSecondary">{message}</Typography>
    </Box>
  );
}

export function LoadingOverlay({ message = "Carregando..." }) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgcolor="rgba(0, 0, 0, 0.7)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      className="fade-in"
    >
      <CircularProgress size={50} sx={{ color: "white" }} />
      <Typography color="white" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}
