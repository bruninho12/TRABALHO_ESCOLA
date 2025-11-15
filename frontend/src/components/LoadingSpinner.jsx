import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = ({
  size = 40,
  thickness = 4,
  color = "primary",
  message = "Carregando...",
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        color={color}
        sx={{
          "&.MuiCircularProgress-root": {
            animationDuration: "1s",
          },
        }}
      />
      {message && (
        <Box
          component="span"
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
