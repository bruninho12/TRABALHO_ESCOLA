const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Login
router.post("/login", authController.login);

// Cadastro
router.post("/register", authController.register);

// Logout
router.post("/logout", authController.logout);

// Refresh Token
router.post("/refresh", authController.refreshToken);

// Esqueci a senha
router.post("/forgot-password", authController.forgotPassword);

// Redefinir senha
router.post("/reset-password", authController.resetPassword);

// Verificar conta
router.get("/verify/:token", authController.verifyAccount);

// Obter perfil do usuário autenticado
router.get("/me", authController.authenticate, authController.getProfile);

module.exports = router;
