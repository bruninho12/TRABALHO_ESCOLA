import { Paper, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function StatCard({
  title,
  value,
  icon,
  color = "primary",
  trend,
  className,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      className={`scale-in ${className}`}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor:
          color === "primary" ? theme.palette.primary.main : "background.paper",
        color: color === "primary" ? "white" : "text.primary",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" component="div" color="inherit">
          {title}
        </Typography>
        {icon}
      </Box>

      <Typography variant="h4" component="div" color="inherit">
        {value}
      </Typography>

      {trend && (
        <Typography
          variant="body2"
          color={trend.startsWith("+") ? "success.main" : "error.main"}
          sx={{ mt: 1 }}
        >
          {trend}
        </Typography>
      )}
    </Paper>
  );
}
