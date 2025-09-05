import express from "express";
import cors from "cors";
import XLSX from "xlsx";

const app = express();

// Configuração CORS mais detalhada para evitar problemas de acesso
app.use(
  cors({
    origin: "*", // Em produção, você pode limitar isso para seus domínios específicos
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Chave secreta para autenticação simples (em produção, use JWT)
const AUTH_SECRET = "controle-despesas-secret-key";

// Dados simulados para usuários e despesas
let usuarios = [
  {
    id: 1,
    nome: "Bruno Souza",
    email: "bruno@exemplo.com",
    senha: "123456", // Em produção, use hash
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@exemplo.com",
    senha: "123456",
  },
];

let despesas = [
  {
    id: 1,
    usuarioId: 1,
    descricao: "Supermercado",
    valor: 250.5,
    categoria: "Alimentação",
    data: "2025-09-01",
    tipo: "despesa",
  },
  {
    id: 2,
    usuarioId: 1,
    descricao: "Salário",
    valor: 3500.0,
    categoria: "Salário",
    data: "2025-09-01",
    tipo: "receita",
  },
  {
    id: 3,
    usuarioId: 1,
    descricao: "Gasolina",
    valor: 180.0,
    categoria: "Transporte",
    data: "2025-09-02",
    tipo: "despesa",
  },
  {
    id: 4,
    usuarioId: 1,
    descricao: "Academia",
    valor: 89.9,
    categoria: "Saúde",
    data: "2025-09-01",
    tipo: "despesa",
  },
  {
    id: 5,
    usuarioId: 2,
    descricao: "Freelance",
    valor: 800.0,
    categoria: "Trabalho Extra",
    data: "2025-09-03",
    tipo: "receita",
  },
];

// Middleware para verificar autenticação simples
const verificarAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Token de autorização necessário" });
  }

  // Autenticação simples baseada no email do usuário
  const userEmail = authHeader.replace("Bearer ", "");
  const usuario = usuarios.find((u) => u.email === userEmail);

  if (!usuario) {
    return res.status(401).json({ message: "Usuário não autorizado" });
  }

  req.usuario = usuario;
  next();
};

// Rota principal para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "API de Controle de Despesas está rodando!",
    version: "1.0.0",
  });
});

// Rota de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
  if (!usuario) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  res.json({
    message: "Login realizado com sucesso",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    token: usuario.email, // Token simples baseado no email
  });
});

// Rota para cadastro de usuário
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  const usuarioExistente = usuarios.find((u) => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ message: "Email já cadastrado" });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha,
  };

  usuarios.push(novoUsuario);

  res.status(201).json({
    message: "Usuário cadastrado com sucesso",
    usuario: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    },
    token: novoUsuario.email,
  });
});

// Obter despesas do usuário logado
app.get("/despesas", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );
  res.json(despesasUsuario);
});

// Adicionar nova despesa/receita
app.post("/despesas", verificarAuth, (req, res) => {
  const { descricao, valor, categoria, data, tipo } = req.body;

  const novaDespesa = {
    id: despesas.length + 1,
    usuarioId: req.usuario.id,
    descricao,
    valor: parseFloat(valor),
    categoria,
    data,
    tipo,
  };

  despesas.push(novaDespesa);
  res.status(201).json({ message: "Item adicionado!", despesa: novaDespesa });
});

// Atualizar despesa/receita
app.put("/despesas/:id", verificarAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const despesaIndex = despesas.findIndex(
    (d) => d.id === id && d.usuarioId === req.usuario.id
  );

  if (despesaIndex === -1) {
    return res.status(404).json({ message: "Item não encontrado!" });
  }

  const { descricao, valor, categoria, data, tipo } = req.body;
  despesas[despesaIndex] = {
    ...despesas[despesaIndex],
    descricao,
    valor: parseFloat(valor),
    categoria,
    data,
    tipo,
  };

  res.json({ message: "Item atualizado!", despesa: despesas[despesaIndex] });
});

// Excluir despesa/receita
app.delete("/despesas/:id", verificarAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const despesaIndex = despesas.findIndex(
    (d) => d.id === id && d.usuarioId === req.usuario.id
  );

  if (despesaIndex === -1) {
    return res.status(404).json({ message: "Item não encontrado!" });
  }

  despesas.splice(despesaIndex, 1);
  res.json({ message: "Item excluído!" });
});

// Obter resumo financeiro
app.get("/resumo", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );

  const totalReceitas = despesasUsuario
    .filter((d) => d.tipo === "receita")
    .reduce((total, d) => total + d.valor, 0);

  const totalDespesas = despesasUsuario
    .filter((d) => d.tipo === "despesa")
    .reduce((total, d) => total + d.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  // Despesas por categoria
  const despesasPorCategoria = {};
  despesasUsuario
    .filter((d) => d.tipo === "despesa")
    .forEach((d) => {
      if (!despesasPorCategoria[d.categoria]) {
        despesasPorCategoria[d.categoria] = 0;
      }
      despesasPorCategoria[d.categoria] += d.valor;
    });

  res.json({
    totalReceitas,
    totalDespesas,
    saldo,
    despesasPorCategoria,
  });
});

// Exportar despesas para Excel
app.get("/exportar", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );
  const ws = XLSX.utils.json_to_sheet(despesasUsuario);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Despesas");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", 'attachment; filename="despesas.xlsx"');
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Ocorreu um erro interno no servidor.",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// Rota para tratar rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Rota ${req.originalUrl} não encontrada!`,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API de Controle de Despesas rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
