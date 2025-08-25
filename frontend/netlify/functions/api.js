// netlify/functions/api.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import XLSX from "xlsx";

const app = express();
app.use(cors());
app.use(express.json());

// Importar os dados dos produtos
let produtos = [
  // ... Seus produtos aqui (copie da sua API original)
];

// Rotas da API
app.get("/api", (req, res) => {
  res.json({
    status: "online",
    message: "InovaTech API está rodando!",
    version: "1.0.0",
  });
});

app.get("/api/produtos", (req, res) => {
  res.json(produtos);
});

app.post("/api/produtos", (req, res) => {
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

// Rota para atualizar produtos
app.put("/api/produtos/:index", (req, res) => {
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

// Rota para excluir produtos
app.delete("/api/produtos/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= produtos.length) {
    return res.status(404).json({ message: "Produto não encontrado!" });
  }

  produtos.splice(index, 1);
  res.json({ message: "Produto excluído com sucesso!" });
});

app.get("/api/exportar", (req, res) => {
  const ws = XLSX.utils.json_to_sheet(produtos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Produtos");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", 'attachment; filename="produtos.xlsx"');
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
});

// Configuração para Netlify Functions
export const handler = serverless(app);
