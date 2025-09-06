import express from "express";
import cors from "cors";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const app = express();

// Garantir que os diretórios necessários existam ao iniciar
console.log("Verificando diretórios necessários...");
try {
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Criando diretório de dados...");
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  console.log("Diretórios verificados com sucesso!");
} catch (error) {
  console.error("Erro ao verificar/criar diretórios:", error);
}

// Configuração CORS - Permitindo todos os domínios Vercel
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://trabalho-escola-5lqz-3rm820502-brunos-projects-4b4f61b9.vercel.app",
  "https://trabalho-escola-brunos-projects-4b4f61b9.vercel.app",
  "https://trabalho-escola.vercel.app",
  "https://trabalho-escola-black.vercel.app",
  /^https:\/\/trabalho-escola-.*\.vercel\.app$/,
  /^https:\/\/.*-brunos-projects-4b4f61b9\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/, // Permite qualquer subdomínio da Vercel
];

// Middleware CORS principal com configuração robusta
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Verificar se o origin está na lista permitida
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === "string") {
          return origin === allowedOrigin;
        }
        // Para regex
        return allowedOrigin.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("CORS bloqueado para origin:", origin);
        // Em desenvolvimento, permitimos todos os origins para facilitar o teste
        const isDev = process.env.NODE_ENV !== "production";
        if (isDev) {
          console.log("Permitindo em modo desenvolvimento");
          callback(null, true);
        } else {
          callback(new Error("Não permitido pelo CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Access-Control-Allow-Origin"],
    optionsSuccessStatus: 200,
  })
);

// Middleware adicional para garantir cabeçalhos CORS em todas as respostas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    // Verificar se a origem está permitida
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return origin === allowedOrigin;
      }
      // Para regex
      return allowedOrigin.test(origin);
    });

    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware adicional para CORS preflight
// Middleware robusto para requisições preflight OPTIONS
app.options("*", (req, res) => {
  const origin = req.get("Origin");

  // Se a origem está permitida, retorne-a, caso contrário, use "*"
  let allowOrigin = "*";

  if (origin) {
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return origin === allowedOrigin;
      }
      // Para regex
      return allowedOrigin.test(origin);
    });

    if (isAllowed) {
      allowOrigin = origin;
    }
  }

  // Configurar cabeçalhos CORS amplos para compatibilidade
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Max-Age", "86400"); // 24 horas
  res.status(200).send();
});

app.use(express.json());

// Chave secreta para autenticação
const AUTH_SECRET = "controle-despesas-secret-key";

// Arquivos de dados
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "usuarios.json");
const EXPENSES_FILE = path.join(DATA_DIR, "despesas.json");

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Função para carregar dados do arquivo
function loadData(filepath, defaultData = []) {
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, "utf8");
      return JSON.parse(data);
    }
    return defaultData;
  } catch (error) {
    console.error(`Erro ao carregar ${filepath}:`, error);
    return defaultData;
  }
}

// Função para salvar dados no arquivo
function saveData(filepath, data) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${filepath}:`, error);
    return false;
  }
}

// Carregar dados iniciais
let usuarios = loadData(USERS_FILE, [
  {
    id: 1,
    nome: "Bruno Souza",
    email: "bruno@exemplo.com",
    senha: "123456",
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "maria@exemplo.com",
    senha: "123456",
  },
]);

let despesas = loadData(EXPENSES_FILE, [
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
]);

// Salvar dados iniciais se os arquivos não existirem
if (!fs.existsSync(USERS_FILE)) {
  saveData(USERS_FILE, usuarios);
}
if (!fs.existsSync(EXPENSES_FILE)) {
  saveData(EXPENSES_FILE, despesas);
}

// Middleware para validar dados de entrada
const validarDespesa = (req, res, next) => {
  const { descricao, valor, categoria, data, tipo } = req.body;

  if (!descricao || valor === undefined || !categoria || !data || !tipo) {
    return res.status(400).json({
      status: "error",
      message: "Todos os campos são obrigatórios",
    });
  }

  if (isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Valor deve ser um número positivo",
    });
  }

  if (!["despesa", "receita"].includes(tipo)) {
    return res.status(400).json({
      status: "error",
      message: "Tipo deve ser 'despesa' ou 'receita'",
    });
  }

  // Validar formato da data
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) {
    return res.status(400).json({
      status: "error",
      message: "Data deve estar no formato YYYY-MM-DD",
    });
  }

  next();
};

// Middleware para verificar autenticação
const verificarAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("Requisição sem token de autorização");
    return res.status(401).json({
      status: "error",
      message: "Token de autorização necessário",
    });
  }

  // Aceita tanto formato "Bearer email@example.com" quanto somente "email@example.com"
  const userEmail = authHeader.replace("Bearer ", "");
  console.log("Email extraído do token:", userEmail);

  const usuario = usuarios.find((u) => u.email === userEmail);

  if (!usuario) {
    console.log(
      `Autenticação falhou: usuário não encontrado para token: ${userEmail}`
    );
    return res.status(401).json({
      status: "error",
      message: "Usuário não autorizado",
    });
  }

  console.log(
    `Usuário autenticado com sucesso: ${usuario.nome} (${usuario.email})`
  );
  req.usuario = usuario;
  next();
};

// ROTAS

// Rota principal
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "API de Controle de Despesas está rodando!",
    version: "2.0.0",
    funcionalidades: [
      "✅ Autenticação de usuários",
      "✅ CRUD de despesas/receitas",
      "✅ Persistência de dados",
      "✅ Busca e filtros",
      "✅ Estatísticas",
      "✅ Exportação Excel/JSON",
      "✅ Backup de dados",
    ],
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  console.log(`Tentativa de login: ${email}`);

  // Validar dados de entrada
  if (!email || !senha) {
    console.log("Login falhou: campos incompletos");
    return res.status(400).json({
      status: "error",
      message: "Email e senha são obrigatórios",
    });
  }

  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
  if (!usuario) {
    console.log("Login falhou: credenciais inválidas");
    return res.status(401).json({
      status: "error",
      message: "Credenciais inválidas",
    });
  }

  console.log(`Login bem-sucedido para: ${usuario.nome}`);
  res.json({
    status: "success",
    message: "Login realizado com sucesso",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    token: usuario.email,
  });
});

// Cadastro
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  console.log(`Tentativa de cadastro: ${nome}, ${email}`);

  if (!nome || !email || !senha) {
    console.log("Cadastro falhou: campos incompletos");
    return res.status(400).json({
      status: "error",
      message: "Todos os campos são obrigatórios",
    });
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Cadastro falhou: formato de email inválido");
    return res.status(400).json({
      status: "error",
      message: "Formato de email inválido",
    });
  }

  // Validação básica de senha (mínimo 6 caracteres)
  if (senha.length < 6) {
    console.log("Cadastro falhou: senha muito curta");
    return res.status(400).json({
      status: "error",
      message: "A senha deve ter pelo menos 6 caracteres",
    });
  }

  const usuarioExistente = usuarios.find((u) => u.email === email);
  if (usuarioExistente) {
    console.log("Cadastro falhou: email já cadastrado");
    return res.status(400).json({
      status: "error",
      message: "Email já cadastrado",
    });
  }

  const novoUsuario = {
    id: Date.now(), // ID único baseado em timestamp
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
    criadoEm: new Date().toISOString(),
  };

  usuarios.push(novoUsuario);

  if (!saveData(USERS_FILE, usuarios)) {
    console.log("Cadastro falhou: erro ao salvar no arquivo");
    return res.status(500).json({
      status: "error",
      message: "Erro ao salvar usuário",
    });
  }

  console.log(
    `Cadastro bem-sucedido para: ${novoUsuario.nome}, ID: ${novoUsuario.id}`
  );
  res.status(201).json({
    status: "success",
    message: "Usuário cadastrado com sucesso",
    usuario: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    },
    token: novoUsuario.email,
  });
});

// Listar despesas/receitas
app.get("/despesas", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );

  // Ordenar por data (mais recente primeiro)
  despesasUsuario.sort((a, b) => new Date(b.data) - new Date(a.data));

  res.json({
    status: "success",
    message: "Dados recuperados com sucesso",
    data: despesasUsuario,
  });
});

// Adicionar despesa/receita
app.post("/despesas", verificarAuth, validarDespesa, (req, res) => {
  const { descricao, valor, categoria, data, tipo } = req.body;

  console.log("Adicionando item:", {
    usuario: req.usuario.email,
    tipo,
    valor,
    categoria,
  });

  const novaDespesa = {
    id: Date.now(),
    usuarioId: req.usuario.id,
    descricao: descricao.trim(),
    valor: parseFloat(valor),
    categoria: categoria.trim(),
    data,
    tipo,
    criadoEm: new Date().toISOString(),
  };

  despesas.push(novaDespesa);

  if (!saveData(EXPENSES_FILE, despesas)) {
    return res.status(500).json({
      status: "error",
      message: "Erro ao salvar despesa",
    });
  }

  res.status(201).json({
    status: "success",
    message: "Item adicionado!",
    data: novaDespesa,
  });
});

// Atualizar despesa/receita
app.put("/despesas/:id", verificarAuth, validarDespesa, (req, res) => {
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
    descricao: descricao.trim(),
    valor: parseFloat(valor),
    categoria: categoria.trim(),
    data,
    tipo,
    atualizadoEm: new Date().toISOString(),
  };

  if (!saveData(EXPENSES_FILE, despesas)) {
    return res.status(500).json({ message: "Erro ao salvar alteração" });
  }

  res.json({ message: "Item atualizado!", despesa: despesas[despesaIndex] });
});

// Excluir despesa/receita
app.delete("/despesas/:id", verificarAuth, (req, res) => {
  const id = parseInt(req.params.id);
  console.log(
    "Solicitação de exclusão - ID:",
    id,
    "Usuário:",
    req.usuario.email
  );

  const despesaIndex = despesas.findIndex(
    (d) => d.id === id && d.usuarioId === req.usuario.id
  );

  if (despesaIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Item não encontrado!",
    });
  }

  const itemExcluido = despesas[despesaIndex];
  console.log("Excluindo item:", itemExcluido);

  despesas.splice(despesaIndex, 1);

  if (!saveData(EXPENSES_FILE, despesas)) {
    return res.status(500).json({
      status: "error",
      message: "Erro ao salvar exclusão",
    });
  }

  res.json({
    status: "success",
    message: "Item excluído!",
    data: itemExcluido,
  });
});

// Buscar com filtros
app.get("/despesas/buscar", verificarAuth, (req, res) => {
  const { categoria, tipo, dataInicio, dataFim, descricao } = req.query;

  let despesasUsuario = despesas.filter((d) => d.usuarioId === req.usuario.id);

  if (categoria) {
    despesasUsuario = despesasUsuario.filter((d) =>
      d.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
  }

  if (tipo && ["despesa", "receita"].includes(tipo)) {
    despesasUsuario = despesasUsuario.filter((d) => d.tipo === tipo);
  }

  if (dataInicio) {
    despesasUsuario = despesasUsuario.filter((d) => d.data >= dataInicio);
  }
  if (dataFim) {
    despesasUsuario = despesasUsuario.filter((d) => d.data <= dataFim);
  }

  if (descricao) {
    despesasUsuario = despesasUsuario.filter((d) =>
      d.descricao.toLowerCase().includes(descricao.toLowerCase())
    );
  }

  despesasUsuario.sort((a, b) => new Date(b.data) - new Date(a.data));

  res.json(despesasUsuario);
});

// Obter categorias
app.get("/categorias", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );

  const categorias = [...new Set(despesasUsuario.map((d) => d.categoria))];

  res.json(categorias.sort());
});

// Resumo financeiro
app.get("/resumo", verificarAuth, (req, res) => {
  console.log("Usuário autenticado:", req.usuario.email);

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

  const despesasPorCategoria = {};
  despesasUsuario
    .filter((d) => d.tipo === "despesa")
    .forEach((d) => {
      despesasPorCategoria[d.categoria] =
        (despesasPorCategoria[d.categoria] || 0) + d.valor;
    });

  res.json({
    status: "success",
    message: "Resumo recuperado com sucesso",
    data: {
      totalReceitas,
      totalDespesas,
      saldo,
      despesasPorCategoria,
    },
  });
});

// Estatísticas detalhadas
app.get("/estatisticas", verificarAuth, (req, res) => {
  const { ano, mes } = req.query;

  let despesasUsuario = despesas.filter((d) => d.usuarioId === req.usuario.id);

  if (ano && mes) {
    const mesFormatado = mes.padStart(2, "0");
    const prefixoData = `${ano}-${mesFormatado}`;
    despesasUsuario = despesasUsuario.filter((d) =>
      d.data.startsWith(prefixoData)
    );
  }

  const receitas = despesasUsuario.filter((d) => d.tipo === "receita");
  const despesasLista = despesasUsuario.filter((d) => d.tipo === "despesa");

  const totalReceitas = receitas.reduce((total, d) => total + d.valor, 0);
  const totalDespesas = despesasLista.reduce((total, d) => total + d.valor, 0);

  const despesasPorCategoria = {};
  despesasLista.forEach((d) => {
    despesasPorCategoria[d.categoria] =
      (despesasPorCategoria[d.categoria] || 0) + d.valor;
  });

  const receitasPorCategoria = {};
  receitas.forEach((d) => {
    receitasPorCategoria[d.categoria] =
      (receitasPorCategoria[d.categoria] || 0) + d.valor;
  });

  res.json({
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    despesasPorCategoria,
    receitasPorCategoria,
    quantidadeItens: despesasUsuario.length,
    mediaGasto:
      despesasLista.length > 0 ? totalDespesas / despesasLista.length : 0,
    periodo: ano && mes ? `${mes}/${ano}` : "Todos os registros",
  });
});

// Backup dos dados
app.get("/backup", verificarAuth, (req, res) => {
  const dadosUsuario = {
    usuario: {
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email,
    },
    despesas: despesas.filter((d) => d.usuarioId === req.usuario.id),
    geradoEm: new Date().toISOString(),
  };

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="backup-${req.usuario.email}-${
      new Date().toISOString().split("T")[0]
    }.json"`
  );
  res.setHeader("Content-Type", "application/json");
  res.json(dadosUsuario);
});

// Exportar Excel
app.get("/exportar", verificarAuth, (req, res) => {
  const despesasUsuario = despesas.filter(
    (d) => d.usuarioId === req.usuario.id
  );

  const dadosExport = despesasUsuario.map((d) => ({
    Data: d.data,
    Descrição: d.descricao,
    Categoria: d.categoria,
    Tipo: d.tipo,
    Valor: d.valor,
  }));

  const ws = XLSX.utils.json_to_sheet(dadosExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Despesas");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="despesas-${req.usuario.email}-${
      new Date().toISOString().split("T")[0]
    }.xlsx"`
  );
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Ocorreu um erro interno no servidor.",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Rota ${req.originalUrl} não encontrada!`,
  });
});

// Iniciar servidor para todas as plataformas
const PORT = process.env.PORT || 3001;

// Inicializar servidor para qualquer ambiente
app.listen(PORT, () => {
  console.log(`API de Controle de Despesas rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Funcionalidades ativas:`);
  console.log(`  ✅ Persistência de dados em arquivos JSON`);
  console.log(`  ✅ Autenticação de usuários`);
  console.log(`  ✅ CRUD completo de despesas/receitas`);
  console.log(`  ✅ Busca e filtros avançados`);
  console.log(`  ✅ Estatísticas e relatórios`);
  console.log(`  ✅ Exportação Excel e JSON`);
  console.log(`  ✅ Backup de dados do usuário`);
  console.log(`  ✅ Validação de dados`);
  console.log(`  ✅ Tratamento de erros`);
});
