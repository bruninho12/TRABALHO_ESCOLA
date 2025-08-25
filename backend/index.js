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

let produtos = [
  {
    nome: "Notebook Dell Inspiron 15",
    quantidadeMinima: 20,
    condicaoPagamento: "30 dias",
    empresa: "Dell",
    valorPago: 5000,
    valorFalta: 2000,
    dataCompra: "2025-08-01",
  },
  {
    nome: 'Monitor LG 24"',
    quantidadeMinima: 30,
    condicaoPagamento: "à vista",
    empresa: "LG",
    valorPago: 1200,
    valorFalta: 0,
    dataCompra: "2025-07-15",
  },
  {
    nome: "Mouse Logitech M170",
    quantidadeMinima: 30,
    condicaoPagamento: "15 dias",
    empresa: "Logitech",
    valorPago: 300,
    valorFalta: 50,
    dataCompra: "2025-07-20",
  },
  {
    nome: "Teclado Mecânico Redragon Kumara",
    quantidadeMinima: 15,
    condicaoPagamento: "45 dias",
    empresa: "Redragon",
    valorPago: 180,
    valorFalta: 70,
    dataCompra: "2025-07-25",
  },
  {
    nome: "Headset Hyperx Cloud II",
    quantidadeMinima: 10,
    condicaoPagamento: "à vista",
    empresa: "HyperX",
    valorPago: 450,
    valorFalta: 0,
    dataCompra: "2025-08-10",
  },
  {
    nome: "SSD Samsung 1TB",
    quantidadeMinima: 25,
    condicaoPagamento: "30 dias",
    empresa: "Samsung",
    valorPago: 350,
    valorFalta: 200,
    dataCompra: "2025-08-05",
  },
  {
    nome: "Placa de Vídeo RTX 4060",
    quantidadeMinima: 8,
    condicaoPagamento: "60 dias",
    empresa: "NVIDIA",
    valorPago: 2000,
    valorFalta: 1500,
    dataCompra: "2025-07-30",
  },
  {
    nome: "Impressora HP LaserJet Pro",
    quantidadeMinima: 5,
    condicaoPagamento: "30 dias",
    empresa: "HP",
    valorPago: 1800,
    valorFalta: 900,
    dataCompra: "2025-08-12",
  },
  {
    nome: "Roteador TP-Link Archer C6",
    quantidadeMinima: 12,
    condicaoPagamento: "à vista",
    empresa: "TP-Link",
    valorPago: 280,
    valorFalta: 0,
    dataCompra: "2025-07-18",
  },
  {
    nome: "Webcam Logitech C920",
    quantidadeMinima: 18,
    condicaoPagamento: "15 dias",
    empresa: "Logitech",
    valorPago: 350,
    valorFalta: 150,
    dataCompra: "2025-08-07",
  },
  {
    nome: "Smartphone Samsung Galaxy S23",
    quantidadeMinima: 10,
    condicaoPagamento: "45 dias",
    empresa: "Samsung",
    valorPago: 3000,
    valorFalta: 1800,
    dataCompra: "2025-08-15",
  },
  {
    nome: "Tablet Apple iPad Pro",
    quantidadeMinima: 7,
    condicaoPagamento: "Dolar",
    empresa: "Apple",
    valorPago: 4500,
    valorFalta: 3000,
    dataCompra: "2025-07-28",
  },
  {
    nome: "Dock Station Universal",
    quantidadeMinima: 22,
    condicaoPagamento: "à vista",
    empresa: "Multilaser",
    valorPago: 220,
    valorFalta: 0,
    dataCompra: "2025-08-03",
  },
  {
    nome: "Memória RAM Kingston 16GB",
    quantidadeMinima: 40,
    condicaoPagamento: "30 dias",
    empresa: "Kingston",
    valorPago: 280,
    valorFalta: 120,
    dataCompra: "2025-07-22",
  },
  {
    nome: "Processador AMD Ryzen 7",
    quantidadeMinima: 15,
    condicaoPagamento: "45 dias",
    empresa: "AMD",
    valorPago: 1500,
    valorFalta: 800,
    dataCompra: "2025-08-08",
  },
  {
    nome: "Estabilizador SMS Revolution",
    quantidadeMinima: 25,
    condicaoPagamento: "à vista",
    empresa: "SMS",
    valorPago: 180,
    valorFalta: 0,
    dataCompra: "2025-07-12",
  },
  {
    nome: "Cabo HDMI 2.1 3 metros",
    quantidadeMinima: 50,
    condicaoPagamento: "15 dias",
    empresa: "Multilaser",
    valorPago: 35,
    valorFalta: 15,
    dataCompra: "2025-08-02",
  },
  {
    nome: "Adaptador USB-C para HDMI",
    quantidadeMinima: 35,
    condicaoPagamento: "à vista",
    empresa: "Baseus",
    valorPago: 70,
    valorFalta: 0,
    dataCompra: "2025-07-16",
  },
  {
    nome: "Cadeira Gamer ThunderX3",
    quantidadeMinima: 8,
    condicaoPagamento: "60 dias",
    empresa: "ThunderX3",
    valorPago: 800,
    valorFalta: 600,
    dataCompra: "2025-08-11",
  },
  {
    nome: "Kit Teclado e Mouse sem Fio",
    quantidadeMinima: 20,
    condicaoPagamento: "30 dias",
    empresa: "Microsoft",
    valorPago: 250,
    valorFalta: 100,
    dataCompra: "2025-07-19",
  },
  {
    nome: 'Monitor Ultrawide LG 29"',
    quantidadeMinima: 12,
    condicaoPagamento: "45 dias",
    empresa: "LG",
    valorPago: 1800,
    valorFalta: 900,
    dataCompra: "2025-08-05",
  },
  {
    nome: "Hub USB 7 Portas",
    quantidadeMinima: 25,
    condicaoPagamento: "à vista",
    empresa: "Anker",
    valorPago: 120,
    valorFalta: 0,
    dataCompra: "2025-07-24",
  },
  {
    nome: "No-Break APC 1500VA",
    quantidadeMinima: 10,
    condicaoPagamento: "60 dias",
    empresa: "APC",
    valorPago: 890,
    valorFalta: 550,
    dataCompra: "2025-08-09",
  },
  {
    nome: "Mouse Pad Gamer Extra Grande",
    quantidadeMinima: 30,
    condicaoPagamento: "15 dias",
    empresa: "Havit",
    valorPago: 55,
    valorFalta: 20,
    dataCompra: "2025-07-27",
  },
  {
    nome: "Suporte Articulado para Monitor",
    quantidadeMinima: 18,
    condicaoPagamento: "30 dias",
    empresa: "ELG",
    valorPago: 180,
    valorFalta: 90,
    dataCompra: "2025-08-14",
  },
  {
    nome: "Fone de Ouvido Bluetooth JBL",
    quantidadeMinima: 22,
    condicaoPagamento: "à vista",
    empresa: "JBL",
    valorPago: 280,
    valorFalta: 0,
    dataCompra: "2025-07-23",
  },
  {
    nome: "Carregador Portátil 20000mAh",
    quantidadeMinima: 15,
    condicaoPagamento: "Credito",
    empresa: "Xiaomi",
    valorPago: 170,
    valorFalta: 80,
    dataCompra: "2025-08-06",
  },
  {
    nome: "Câmera de Segurança Wi-Fi",
    quantidadeMinima: 10,
    condicaoPagamento: "45 dias",
    empresa: "Intelbras",
    valorPago: 240,
    valorFalta: 150,
    dataCompra: "2025-07-17",
  },
  {
    nome: "Projetor Epson PowerLite",
    quantidadeMinima: 5,
    condicaoPagamento: "60 dias",
    empresa: "Epson",
    valorPago: 3200,
    valorFalta: 1800,
    dataCompra: "2025-08-13",
  },
];

// Rota principal para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "InovaTech API está rodando!",
    version: "1.0.0",
  });
});

app.get("/produtos", (req, res) => {
  res.json(produtos);
});

app.post("/produtos", (req, res) => {
  const {
    nome,
    quantidadeMinima,
    condicaoPagamento,
    empresa,
    valorPago,
    valorFalta,
    dataCompra,
  } = req.body;
  produtos.push({
    nome,
    quantidadeMinima,
    condicaoPagamento,
    empresa,
    valorPago,
    valorFalta,
    dataCompra,
  });
  res.status(201).json({ message: "Produto adicionado!" });
});

// Nova rota para atualizar produtos
app.put("/produtos/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= produtos.length) {
    return res.status(404).json({ message: "Produto não encontrado!" });
  }

  const {
    nome,
    quantidadeMinima,
    condicaoPagamento,
    empresa,
    valorPago,
    valorFalta,
    dataCompra,
  } = req.body;

  produtos[index] = {
    nome,
    quantidadeMinima,
    condicaoPagamento,
    empresa,
    valorPago,
    valorFalta,
    dataCompra,
  };

  res.json({ message: "Produto atualizado com sucesso!" });
});

// Nova rota para excluir produtos
app.delete("/produtos/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= produtos.length) {
    return res.status(404).json({ message: "Produto não encontrado!" });
  }

  produtos.splice(index, 1);
  res.json({ message: "Produto excluído com sucesso!" });
});

app.get("/exportar", (req, res) => {
  const ws = XLSX.utils.json_to_sheet(produtos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produtos");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", 'attachment; filename="produtos.xlsx"');
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
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
