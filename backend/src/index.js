const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");
const { connectDB } = require("./config/mongoConfig");
const { setupSwagger } = require("./config/swagger");

// Carrega variáveis de ambiente
require("dotenv").config();

// Inicializa o app Express
const app = express();

// Configurações de segurança
app.use(helmet());

// Compressão para reduzir tamanho das respostas
app.use(compression());

// Configuração de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de origens permitidas
    const allowedOrigins = [
      "http://localhost:8080",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:1500", // Adicionando possíveis origens do frontend
      "http://localhost:1500",
    ];

    // Em modo de desenvolvimento, aceitar todas as origens
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // Permite requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origem bloqueada pelo CORS: ${origin}`);
      callback(new Error("Não permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Parser para JSON
app.use(express.json());

// Parser para dados de formulários
app.use(express.urlencoded({ extended: true }));

// Logs de requisições em ambiente de desenvolvimento
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting para prevenir abusos
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos por padrão
  max: process.env.RATE_LIMIT_MAX || 100, // limite de 100 requisições por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Muitas requisições, por favor tente novamente mais tarde.",
  },
});
app.use("/api/", limiter);

// Configurar Swagger
setupSwagger(app);

// Registro das rotas da API
app.use("/api", routes);

// Servir arquivos estáticos em produção (frontend)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend-react/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend-react/dist/index.html"));
  });
}

// Middleware para tratamento de erros
app.use(errorHandler);

// Conectar ao MongoDB antes de exportar
connectDB().catch((err) => {
  console.error(`Erro ao conectar ao MongoDB: ${err.message}`);
  process.exit(1);
});

module.exports = app;
