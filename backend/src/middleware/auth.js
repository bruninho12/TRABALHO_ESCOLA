const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token existe no header
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // Extrair o token do header
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "chave_secreta_muito_segura_para_autenticacao_jwt"
    );
    console.log("[authenticate] decoded:", decoded);
    if (!decoded) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Buscar o usuário usando 'id' (não 'userId')
    const user = await User.findById(decoded.id).select("-password");
    console.log("[authenticate] user:", user);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Verificar se o usuário está bloqueado
    if (user.isBlocked) {
      console.log("[authenticate] Usuário bloqueado:", user.email);
      return res.status(403).json({
        message: "Sua conta foi bloqueada",
        reason: user.blockReason || "Motivo não informado",
      });
    }

    // Adicionar o usuário ao objeto da requisição
    // Garantir consistência entre `_id` (ObjectId) e `id` (string)
    user.id = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    }
    res
      .status(500)
      .json({ message: "Erro na autenticação", error: error.message });
  }
};
