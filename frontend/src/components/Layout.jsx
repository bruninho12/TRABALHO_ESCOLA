import React, { useState } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
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
  SportsEsports as RPGIcon,
  Lightbulb as InsightsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleThemeToggle = () => {
    toggleDarkMode();
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
    navigate("/dashboard/settings");
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    {
      path: "/dashboard/transactions",
      label: "Transações",
      icon: <TransactionsIcon />,
    },
    { path: "/dashboard/goals", label: "Metas", icon: <GoalsIcon /> },
    { path: "/dashboard/insights", label: "Insights", icon: <InsightsIcon /> },
    { path: "/dashboard/payments", label: "Pagamentos", icon: <PaymentIcon /> },
    { path: "/dashboard/reports", label: "Relatórios", icon: <ReportsIcon /> },
    { path: "/dashboard/rpg", label: "RPG", icon: <RPGIcon /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "hidden", // Prevenir scroll horizontal
        position: "relative",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: isDarkMode
            ? "rgba(31, 41, 55, 0.95)"
            : "rgba(255, 255, 255, 0.98)",
          color: isDarkMode ? "white" : "#1f2937",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          zIndex: 1201,
          boxShadow: { xs: "0 2px 8px rgba(0,0,0,0.1)", md: "none" },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "56px", sm: "64px" },
            px: { xs: 0.5, sm: 1, md: 2 },
            py: { xs: 0, sm: 0.5 },
          }}
        >
          {/* Menu Mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{
                mr: { xs: 0.5, sm: 1 },
                p: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
                md: "1.1rem",
                lg: "1.25rem",
              },
              fontWeight: { xs: 600, md: 700 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ml: { xs: 0.5, sm: 0 },
            }}
          >
            🎯 DespFinance
          </Typography>

          {/* Menu Desktop - Responsivo */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: { sm: 0.5, md: 1 } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 0.5,
                    px: 2,
                    py: 1,
                    color: isDarkMode ? "white" : "#1f2937",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(102, 126, 234, 0.1)",
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(102, 126, 234, 0.15)",
                      borderBottom: isDarkMode
                        ? "2px solid white"
                        : "2px solid #667eea",
                    }),
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Botões de ação */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.25, sm: 0.5, md: 1 },
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              sx={{
                color: isDarkMode ? "white" : "#1f2937",
                p: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {isDarkMode ? (
                <LightModeIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
              )}
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleNotificationMenu}
              sx={{
                color: isDarkMode ? "white" : "#1f2937",
                p: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Badge
                badgeContent={4}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    minWidth: { xs: 16, sm: 20 },
                    height: { xs: 16, sm: 20 },
                  },
                }}
              >
                <NotificationsIcon
                  sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{
                color: isDarkMode ? "white" : "#1f2937",
                p: { xs: 0.5, sm: 0.75 },
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 28, sm: 32, md: 36 },
                  height: { xs: 28, sm: 32, md: 36 },
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                {user?.name?.[0] || "U"}
              </Avatar>
            </IconButton>
          </Box>

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

      {/* Drawer Mobile - Muito Melhorado */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: "min(85vw, 300px)", sm: 320 },
            maxWidth: { xs: 300, sm: 320 },
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "white" : "#1f2937",
            borderRadius: { xs: "0 20px 20px 0", sm: "0 24px 24px 0" },
            boxShadow: {
              xs: "0 8px 32px rgba(0, 0, 0, 0.15)",
              sm: "0 12px 40px rgba(0, 0, 0, 0.12)",
            },
            backgroundImage: isDarkMode
              ? "linear-gradient(145deg, #1f2937 0%, #374151 100%)"
              : "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
          },
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <Box sx={{ overflow: "auto", height: "100%" }}>
          {/* Header do Drawer - Muito Melhorado */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: { xs: 1.5, sm: 2 },
              borderBottom: `1px solid ${
                isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
              background: isDarkMode
                ? "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)"
                : "linear-gradient(90deg, rgba(102,126,234,0.05) 0%, transparent 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  background: isDarkMode
                    ? "linear-gradient(45deg, #ffffff 0%, #e5e7eb 100%)"
                    : "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                🎯 DespFinance
              </Typography>
            </Box>
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{
                p: { xs: 0.75, sm: 1 },
                borderRadius: 2,
                color: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  color: isDarkMode ? "white" : "black",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Box>

          {/* Lista de navegação - Muito Melhorada */}
          <List sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem
                  key={item.path}
                  onClick={() => handleMobileNavigation(item.path)}
                  sx={{
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 1, sm: 1.5 },
                    mb: { xs: 0.5, sm: 0.75 },
                    cursor: "pointer",
                    borderRadius: 3,
                    border: isActive
                      ? `1px solid ${
                          isDarkMode
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(102,126,234,0.3)"
                        }`
                      : "1px solid transparent",
                    background: isActive
                      ? isDarkMode
                        ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
                        : "linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(102,126,234,0.05) 100%)"
                      : "transparent",
                    boxShadow: isActive
                      ? isDarkMode
                        ? "0 4px 12px rgba(255,255,255,0.1)"
                        : "0 4px 12px rgba(102,126,234,0.15)"
                      : "none",
                    transform: isActive ? "translateX(4px)" : "translateX(0)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: isActive
                        ? undefined
                        : isDarkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(102, 126, 234, 0.08)",
                      transform: isActive
                        ? "translateX(4px)"
                        : "translateX(2px)",
                      boxShadow: isActive
                        ? undefined
                        : isDarkMode
                        ? "0 2px 8px rgba(255,255,255,0.05)"
                        : "0 2px 8px rgba(102,126,234,0.1)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? isDarkMode
                          ? "white"
                          : "#667eea"
                        : isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "#64748b",
                      minWidth: { xs: 36, sm: 40 },
                      "& svg": {
                        fontSize: { xs: 20, sm: 22 },
                        transition: "all 0.3s ease",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: { xs: "0.875rem", sm: "0.95rem" },
                        fontWeight: isActive ? 600 : 500,
                        color: isActive
                          ? isDarkMode
                            ? "white"
                            : "#667eea"
                          : isDarkMode
                          ? "rgba(255, 255, 255, 0.9)"
                          : "#374151",
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        borderRadius: 2,
                        background: isDarkMode ? "white" : "#667eea",
                        ml: 1,
                        animation: "fadeIn 0.3s ease",
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Ações do usuário */}
          <List>
            <ListItem onClick={handleSettings} sx={{ cursor: "pointer" }}>
              <ListItemIcon
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#64748b",
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItem>
            <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
              <ListItemIcon sx={{ color: "#ef4444" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sair"
                sx={{ "& .MuiListItemText-primary": { color: "#ef4444" } }}
              />
            </ListItem>
          </List>

          {/* Informações do usuário */}
          <Box
            sx={{ p: 2, mt: "auto", borderTop: "1px solid rgba(0,0,0,0.1)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {user?.name?.[0] || "U"}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name || "Usuário"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <main
        style={{
          flex: 1,
          padding: isMobile ? "8px" : "16px",
          paddingTop: isMobile ? "12px" : "20px",
          paddingBottom: isMobile ? "16px" : "24px",
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: `calc(100vh - ${isMobile ? "56px" : "64px"})`,
          overflow: "auto",
          position: "relative",
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        }}
      >
        {/* Container responsivo para o conteúdo */}
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: "1200px",
              lg: "1400px",
              xl: "1600px",
            },
            mx: "auto",
            px: { xs: 0, sm: 0.5, md: 1, lg: 2 },
            py: { xs: 0, sm: 0.5 },
            position: "relative",
            minHeight: "100%",
          }}
        >
          <Outlet />
        </Box>
      </main>
    </div>
  );
};

export default Layout;
