import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountBalance as TransactionsIcon,
  Payment as PaymentIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  EmojiEvents as GoalsIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const isDarkMode = theme.palette.mode === "dark";

  const handleThemeToggle = () => {
    if (window.toggleDarkMode) {
      window.toggleDarkMode();
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/transactions", label: "Transações", icon: <TransactionsIcon /> },
    { path: "/goals", label: "Metas", icon: <GoalsIcon /> },
    { path: "/payments", label: "Pagamentos", icon: <PaymentIcon /> },
    { path: "/reports", label: "Relatórios", icon: <ReportsIcon /> },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎯 DespFinance v2.0
          </Typography>

          <div>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  ...(location.pathname === item.path && {
                    borderBottom: "2px solid white",
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <IconButton color="inherit" onClick={handleThemeToggle}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleNotificationMenu}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenu} color="inherit">
            <Avatar>{user?.name?.[0] || "U"}</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 1 }} />
              Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
          >
            <MenuItem>Notificação 1</MenuItem>
            <MenuItem>Notificação 2</MenuItem>
            <MenuItem>Notificação 3</MenuItem>
            <MenuItem>Ver todas</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
