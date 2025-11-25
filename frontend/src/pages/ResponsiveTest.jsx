import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  useResponsive,
} from "../components/ResponsiveComponents";

const ResponsiveTestPage = () => {
  const { isMobile, isMobileSmall, isTablet } = useResponsive();

  return (
    <ResponsiveContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          🔧 Teste de Responsividade Mobile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dispositivo:{" "}
          {isMobileSmall
            ? "Mobile Small"
            : isMobile
            ? "Mobile"
            : isTablet
            ? "Tablet"
            : "Desktop"}
        </Typography>
      </Box>

      {/* Teste de Cards Responsivos */}
      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ xs: 1, sm: 1.5, md: 2 }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <ResponsiveCard key={item}>
            <Typography variant="h6" gutterBottom>
              Card {item}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Este é um card responsivo que se adapta automaticamente ao tamanho
              da tela.
            </Typography>
            <Box
              sx={{
                mt: 2,
                p: 1,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 1,
              }}
            >
              <Typography variant="caption">
                {isMobileSmall
                  ? "Mobile Small"
                  : isMobile
                  ? "Mobile"
                  : isTablet
                  ? "Tablet"
                  : "Desktop"}
              </Typography>
            </Box>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>

      {/* Teste de Espaçamentos */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Teste de Espaçamentos Mobile
        </Typography>
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography>
            Este box tem padding responsivo:{" "}
            {isMobile ? "Pequeno (Mobile)" : "Grande (Desktop)"}
          </Typography>
        </Box>
      </Box>

      {/* Teste de Texto Responsivo */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant={isMobileSmall ? "h6" : isMobile ? "h5" : "h4"}
          gutterBottom
        >
          Título Responsivo
        </Typography>
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color="text.secondary"
        >
          Este texto se adapta ao tamanho da tela automaticamente.
        </Typography>
      </Box>
    </ResponsiveContainer>
  );
};

export default ResponsiveTestPage;
