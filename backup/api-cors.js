import express from "express";
import cors from "cors";
import XLSX from "xlsx";

const app = express();

// CORS Middleware - SUPER PERMISSIVO
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Headers para todas as rotas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Tratamento especial para OPTIONS
app.options("*", (req, res) => {
  res.status(204).send();
});

app.use(express.json());

// Chave secreta para autenticação
const AUTH_SECRET = "controle-despesas-secret-key";

// Dados em memória (para demonstração - em produção use banco de dados)
let usuarios = [
  {
    id: 1,
    nome: "Bruno Souza",
    email: "bruno@teste.com",
    senha: "123456",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@teste.com",
    senha: "123456",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
];

let despesas = [
  {
    id: 1,
    usuarioId: 1,
    tipo: "despesa",
    categoria: "Alimentação",
    descricao: "Mercado da semana",
    valor: 250.5,
    data: "2025-09-01",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
  {
    id: 2,
    usuarioId: 1,
    tipo: "receita",
    categoria: "Salário",
    descricao: "Salário setembro",
    valor: 5000.0,
    data: "2025-09-01",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
  {
    id: 3,
    usuarioId: 1,
    tipo: "despesa",
    categoria: "Transporte",
    descricao: "Uber",
    valor: 25.8,
    data: "2025-09-02",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
  {
    id: 4,
    usuarioId: 2,
    tipo: "despesa",
    categoria: "Lazer",
    descricao: "Cinema",
    valor: 45.0,
    data: "2025-09-03",
    criadoEm: "2025-09-05T00:00:00.000Z",
  },
];

// Middleware de validação de token
function verificarToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token de acesso requerido" });
  }

  try {
    const userId = parseInt(token.replace("Bearer ", ""));
    req.usuarioId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Rota de teste CORS
app.get("/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS está funcionando!",
    timestamp: new Date().toISOString(),
    headers: {
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    },
  });
});

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API Controle de Despesas funcionando!",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET / - Status da API",
      "POST /login - Fazer login",
      "POST /cadastro - Cadastrar usuário",
      "GET /resumo - Resumo financeiro",
      "GET /despesas - Listar despesas",
      "POST /despesas - Criar despesa",
      "PUT /despesas/:id - Atualizar despesa",
      "DELETE /despesas/:id - Deletar despesa",
      "GET /exportar - Exportar dados",
    ],
  });
});

// Rota de login
app.post("/login", (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        status: "error",
        message: "Email e senha são obrigatórios",
      });
    }

    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!usuario) {
      return res.status(401).json({
        status: "error",
        message: "Credenciais inválidas",
      });
    }

    const token = usuario.id.toString();

    res.json({
      status: "success",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota de cadastro
app.post("/cadastro", (req, res) => {
  try {
    console.log("Recebido pedido de cadastro:", req.body);

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        status: "error",
        message: "Nome, email e senha são obrigatórios",
      });
    }

    const usuarioExistente = usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
      return res.status(400).json({
        status: "error",
        message: "Email já está em uso",
      });
    }

    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha,
      criadoEm: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    const token = novoUsuario.id.toString();

    console.log("Novo usuário criado:", {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
    });

    res.status(201).json({
      status: "success",
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
      message: "Usuário cadastrado com sucesso",
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota de resumo
app.get("/resumo", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const despesasUsuario = despesas.filter((d) => d.usuarioId === usuarioId);

    const totalReceitas = despesasUsuario
      .filter((d) => d.tipo === "receita")
      .reduce((total, d) => total + d.valor, 0);

    const totalDespesas = despesasUsuario
      .filter((d) => d.tipo === "despesa")
      .reduce((total, d) => total + d.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    res.json({
      status: "success",
      data: {
        totalReceitas,
        totalDespesas,
        saldo,
        totalTransacoes: despesasUsuario.length,
      },
    });
  } catch (error) {
    console.error("Erro no resumo:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota para listar despesas
app.get("/despesas", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const despesasUsuario = despesas
      .filter((d) => d.usuarioId === usuarioId)
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    res.json({
      status: "success",
      data: despesasUsuario,
    });
  } catch (error) {
    console.error("Erro ao listar despesas:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota para criar despesa
app.post("/despesas", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const { tipo, categoria, descricao, valor, data } = req.body;

    if (!tipo || !categoria || !descricao || !valor || !data) {
      return res.status(400).json({
        status: "error",
        message: "Todos os campos são obrigatórios",
      });
    }

    const novaDespesa = {
      id: despesas.length + 1,
      usuarioId,
      tipo,
      categoria,
      descricao,
      valor: parseFloat(valor),
      data,
      criadoEm: new Date().toISOString(),
    };

    despesas.push(novaDespesa);

    res.status(201).json({
      status: "success",
      data: novaDespesa,
      message: "Transação criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota para atualizar despesa
app.put("/despesas/:id", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const { id } = req.params;
    const { tipo, categoria, descricao, valor, data } = req.body;

    const despesaIndex = despesas.findIndex(
      (d) => d.id === parseInt(id) && d.usuarioId === usuarioId
    );

    if (despesaIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Transação não encontrada",
      });
    }

    despesas[despesaIndex] = {
      ...despesas[despesaIndex],
      tipo,
      categoria,
      descricao,
      valor: parseFloat(valor),
      data,
      atualizadoEm: new Date().toISOString(),
    };

    res.json({
      status: "success",
      data: despesas[despesaIndex],
      message: "Transação atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota para deletar despesa
app.delete("/despesas/:id", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const { id } = req.params;

    const despesaIndex = despesas.findIndex(
      (d) => d.id === parseInt(id) && d.usuarioId === usuarioId
    );

    if (despesaIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Transação não encontrada",
      });
    }

    despesas.splice(despesaIndex, 1);

    res.json({
      status: "success",
      message: "Transação deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar despesa:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota para exportar dados
app.get("/exportar", verificarToken, (req, res) => {
  try {
    const { usuarioId } = req;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    const despesasUsuario = despesas.filter((d) => d.usuarioId === usuarioId);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(despesasUsuario);
    XLSX.utils.book_append_sheet(wb, ws, "Despesas");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=despesas_${usuario.nome.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao exportar:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno do servidor",
    });
  }
});

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Rota ${req.originalUrl} não encontrada!`,
  });
});

// Para Vercel (serverless)
export default app;

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ API Controle de Despesas rodando na porta ${PORT}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`📊 Dados de demonstração carregados!`);
  });
}
