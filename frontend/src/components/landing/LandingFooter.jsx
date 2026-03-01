import React from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";

const LandingFooter = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: "#0f172a",
      color: "white",
      py: 8,
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              F
            </Box>
            <Typography variant="h6" color="white" fontWeight={700}>
              DespFinance
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="#94a3b8"
            mb={3}
            lineHeight={1.7}
          >
            Gamificação + Finanças Pessoais + Sistema Intuitivo + Suporte
            qualificado
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="h6" color="white" fontWeight={700} mb={3}>
            Produto
          </Typography>
          <Stack spacing={2}>
            {["Recursos", "Gamificação", "Preços", "Central de Ajuda"].map(
              (link) => (
                <Typography
                  key={link}
                  variant="body2"
                  color="#94a3b8"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { color: "#6366f1" },
                    transition: "color 0.3s",
                  }}
                >
                  {link}
                </Typography>
              )
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" color="white" fontWeight={700} mb={3}>
            Legal
          </Typography>
          <Stack spacing={2}>
            {["Termos de Uso", "Privacidade", "Cancelamento"].map((link) => (
              <Typography
                key={link}
                variant="body2"
                color="#94a3b8"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "#6366f1" },
                  transition: "color 0.3s",
                }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" color="white" fontWeight={700} mb={3}>
            Contato
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2" color="#94a3b8">
              contato@despfinance.app
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              WhatsApp: (11) 99999-9999
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          borderTop: "1px solid #334155",
          mt: 6,
          pt: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="#94a3b8">
          © 2025 DespFinance. Todos os direitos reservados.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default LandingFooter;

