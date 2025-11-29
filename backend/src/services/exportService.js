/**
 * 📊 Serviço de Exportação Avançada
 * Gera relatórios em PDF e Excel com gráficos e análises
 */

const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const User = require("../models/User");
const { logger } = require("../utils/logger");

class ExportService {
  constructor() {
    this.exportsDir = path.join(__dirname, "../../exports");

    // Cria diretório de exports se não existir
    if (!fs.existsSync(this.exportsDir)) {
      fs.mkdirSync(this.exportsDir, { recursive: true });
    }
  }

  /**
   * 📄 Gera relatório completo em PDF
   */
  async generatePDFReport(userId, options = {}) {
    try {
      logger.info(`📄 Gerando relatório PDF para usuário ${userId}`);

      const {
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate = new Date(),
        includeGoals = true,
        includeBudgets = true,
      } = options;

      // Busca dados
      const user = await User.findById(userId);
      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      })
        .populate("categoryId", "name type icon")
        .sort({ date: -1 });

      const budgets = includeBudgets
        ? await Budget.find({ userId }).populate("categoryId", "name")
        : [];

      const goals = includeGoals
        ? await Goal.find({ userId, status: "active" })
        : [];

      // Cria documento PDF
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const filename = `relatorio_${user.name.replace(
        /\s/g,
        "_"
      )}_${Date.now()}.pdf`;
      const filepath = path.join(this.exportsDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // 🎨 CABEÇALHO
      this.addPDFHeader(doc, user, startDate, endDate);

      // 💰 RESUMO FINANCEIRO
      doc.moveDown(2);
      this.addFinancialSummary(doc, transactions);

      // 📊 TRANSAÇÕES POR CATEGORIA
      doc.addPage();
      this.addCategoryBreakdown(doc, transactions);

      // 💳 ORÇAMENTOS (se incluído)
      if (includeBudgets && budgets.length > 0) {
        doc.addPage();
        this.addBudgetSection(doc, budgets);
      }

      // 🎯 METAS (se incluído)
      if (includeGoals && goals.length > 0) {
        doc.addPage();
        this.addGoalsSection(doc, goals);
      }

      // 📋 LISTA DE TRANSAÇÕES
      doc.addPage();
      this.addTransactionsList(doc, transactions.slice(0, 50)); // Limita a 50

      // 📅 RODAPÉ
      this.addPDFFooter(doc);

      doc.end();

      // Aguarda finalização
      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      logger.info(`✅ PDF gerado: ${filename}`);

      return {
        filename,
        filepath,
        url: `/exports/${filename}`,
      };
    } catch (error) {
      logger.error("Erro ao gerar PDF:", error);
      throw error;
    }
  }

  /**
   * 📗 Gera relatório em Excel
   */
  async generateExcelReport(userId, options = {}) {
    try {
      logger.info(`📗 Gerando relatório Excel para usuário ${userId}`);

      const {
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate = new Date(),
      } = options;

      // Busca dados
      const user = await User.findById(userId);
      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      })
        .populate("categoryId", "name type")
        .sort({ date: -1 });

      // Cria workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "DespFinancee";
      workbook.created = new Date();

      // 📊 ABA 1: Resumo
      const summarySheet = workbook.addWorksheet("Resumo");
      this.addExcelSummary(
        summarySheet,
        user,
        transactions,
        startDate,
        endDate
      );

      // 💰 ABA 2: Transações
      const transactionsSheet = workbook.addWorksheet("Transações");
      this.addExcelTransactions(transactionsSheet, transactions);

      // 📈 ABA 3: Por Categoria
      const categorySheet = workbook.addWorksheet("Por Categoria");
      this.addExcelCategoryAnalysis(categorySheet, transactions);

      // 📅 ABA 4: Por Mês
      const monthlySheet = workbook.addWorksheet("Mensal");
      this.addExcelMonthlyAnalysis(monthlySheet, transactions);

      // Salva arquivo
      const filename = `relatorio_${user.name.replace(
        /\s/g,
        "_"
      )}_${Date.now()}.xlsx`;
      const filepath = path.join(this.exportsDir, filename);
      await workbook.xlsx.writeFile(filepath);

      logger.info(`✅ Excel gerado: ${filename}`);

      return {
        filename,
        filepath,
        url: `/exports/${filename}`,
      };
    } catch (error) {
      logger.error("Erro ao gerar Excel:", error);
      throw error;
    }
  }

  // ============================================
  // 📄 MÉTODOS AUXILIARES PDF
  // ============================================

  addPDFHeader(doc, user, startDate, endDate) {
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#6366F1")
      .text("💰 DespFinancee", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(18)
      .fillColor("#111827")
      .text("Relatório Financeiro Detalhado", { align: "center" });

    doc
      .moveDown(1)
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#6B7280")
      .text(`Cliente: ${user.name}`, { align: "center" })
      .text(`Email: ${user.email}`, { align: "center" })
      .text(
        `Período: ${startDate.toLocaleDateString(
          "pt-BR"
        )} a ${endDate.toLocaleDateString("pt-BR")}`,
        { align: "center" }
      );

    doc
      .moveDown(1)
      .strokeColor("#E5E7EB")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
  }

  addFinancialSummary(doc, transactions) {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("💵 Resumo Financeiro", 50, doc.y);

    doc.moveDown(1);

    // Card de receitas
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#10B981")
      .text(`📈 Total de Receitas: R$ ${income.toFixed(2)}`, 70);

    doc.moveDown(0.5);

    // Card de despesas
    doc
      .fillColor("#EF4444")
      .text(`📉 Total de Despesas: R$ ${expenses.toFixed(2)}`, 70);

    doc.moveDown(0.5);

    // Saldo
    doc
      .fillColor(balance >= 0 ? "#10B981" : "#EF4444")
      .text(`💰 Saldo: R$ ${balance.toFixed(2)}`, 70);

    doc.moveDown(1);

    // Estatísticas adicionais
    doc
      .fontSize(10)
      .fillColor("#6B7280")
      .text(`Total de Transações: ${transactions.length}`, 70)
      .text(
        `Média de Gastos: R$ ${(
          expenses / transactions.filter((t) => t.type === "expense").length ||
          0
        ).toFixed(2)}`,
        70
      );
  }

  addCategoryBreakdown(doc, transactions) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("📊 Gastos por Categoria", 50);

    doc.moveDown(1);

    // Agrupa por categoria
    const categoryMap = new Map();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const categoryName = t.categoryId?.name || "Outros";
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + t.amount
        );
      });

    // Ordena por valor
    const sortedCategories = Array.from(categoryMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    let y = doc.y;
    sortedCategories.forEach(([category, amount], index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#111827")
        .text(`${index + 1}. ${category}`, 70, y);

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#6366F1")
        .text(`R$ ${amount.toFixed(2)}`, 400, y, { align: "right" });

      y += 25;
    });
  }

  addBudgetSection(doc, budgets) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("💳 Orçamentos", 50);

    doc.moveDown(1);

    let y = doc.y;
    budgets.forEach((budget) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
      const status = percentage >= 90 ? "🚨" : percentage >= 80 ? "⚠️" : "✅";

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(`${status} ${budget.categoryId?.name || "Categoria"}`, 70, y);

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#6B7280")
        .text(
          `Gasto: R$ ${budget.spent.toFixed(2)} de R$ ${budget.limit.toFixed(
            2
          )} (${percentage.toFixed(0)}%)`,
          70,
          y + 15
        );

      y += 50;
    });
  }

  addGoalsSection(doc, goals) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("🎯 Metas Financeiras", 50);

    doc.moveDown(1);

    let y = doc.y;
    goals.forEach((goal) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const percentage = Math.min(
        (goal.currentAmount / goal.targetAmount) * 100,
        100
      );

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(`🎯 ${goal.name}`, 70, y);

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#6B7280")
        .text(
          `Progresso: R$ ${goal.currentAmount.toFixed(
            2
          )} / R$ ${goal.targetAmount.toFixed(2)} (${percentage.toFixed(0)}%)`,
          70,
          y + 15
        );

      y += 50;
    });
  }

  addTransactionsList(doc, transactions) {
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("📋 Últimas Transações", 50);

    doc.moveDown(1);

    let y = doc.y;
    transactions.forEach((transaction) => {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }

      const icon = transaction.type === "income" ? "💰" : "💸";
      const color = transaction.type === "income" ? "#10B981" : "#EF4444";

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#6B7280")
        .text(transaction.date.toLocaleDateString("pt-BR"), 70, y);

      doc
        .fontSize(10)
        .fillColor("#111827")
        .text(`${icon} ${transaction.description}`, 150, y);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor(color)
        .text(`R$ ${transaction.amount.toFixed(2)}`, 450, y, {
          align: "right",
        });

      y += 20;
    });
  }

  addPDFFooter(doc) {
    const pageCount = doc.bufferedPageRange().count;

    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(8)
        .fillColor("#9CA3AF")
        .text(
          `Gerado em ${new Date().toLocaleString(
            "pt-BR"
          )} | DespFinancee © 2025`,
          50,
          750,
          { align: "center" }
        );

      doc.text(`Página ${i + 1} de ${pageCount}`, 50, 765, { align: "center" });
    }
  }

  // ============================================
  // 📗 MÉTODOS AUXILIARES EXCEL
  // ============================================

  addExcelSummary(sheet, user, transactions, startDate, endDate) {
    // Cabeçalho
    sheet.getCell("A1").value = "💰 DespFinancee - Relatório Financeiro";
    sheet.getCell("A1").font = {
      bold: true,
      size: 16,
      color: { argb: "FF6366F1" },
    };
    sheet.mergeCells("A1:E1");

    sheet.getCell("A3").value = `Cliente: ${user.name}`;
    sheet.getCell("A4").value = `Email: ${user.email}`;
    sheet.getCell("A5").value = `Período: ${startDate.toLocaleDateString(
      "pt-BR"
    )} a ${endDate.toLocaleDateString("pt-BR")}`;

    // Resumo financeiro
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    sheet.getCell("A7").value = "📈 Total de Receitas";
    sheet.getCell("B7").value = income;
    sheet.getCell("B7").numFmt = "R$ #,##0.00";
    sheet.getCell("B7").font = { bold: true, color: { argb: "FF10B981" } };

    sheet.getCell("A8").value = "📉 Total de Despesas";
    sheet.getCell("B8").value = expenses;
    sheet.getCell("B8").numFmt = "R$ #,##0.00";
    sheet.getCell("B8").font = { bold: true, color: { argb: "FFEF4444" } };

    sheet.getCell("A9").value = "💰 Saldo";
    sheet.getCell("B9").value = income - expenses;
    sheet.getCell("B9").numFmt = "R$ #,##0.00";
    sheet.getCell("B9").font = { bold: true };

    // Ajusta largura das colunas
    sheet.getColumn("A").width = 30;
    sheet.getColumn("B").width = 20;
  }

  addExcelTransactions(sheet, transactions) {
    // Cabeçalhos
    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    sheet.addRow(headers);
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6366F1" },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    // Dados
    transactions.forEach((t) => {
      sheet.addRow([
        t.date.toLocaleDateString("pt-BR"),
        t.description,
        t.categoryId?.name || "Outros",
        t.type === "income" ? "Receita" : "Despesa",
        t.amount,
      ]);
    });

    // Formata coluna de valor
    sheet.getColumn("E").numFmt = "R$ #,##0.00";
    sheet.getColumn("E").alignment = { horizontal: "right" };

    // Ajusta largura
    sheet.getColumn("A").width = 15;
    sheet.getColumn("B").width = 40;
    sheet.getColumn("C").width = 20;
    sheet.getColumn("D").width = 12;
    sheet.getColumn("E").width = 15;
  }

  addExcelCategoryAnalysis(sheet, transactions) {
    // Agrupa por categoria
    const categoryMap = new Map();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const categoryName = t.categoryId?.name || "Outros";
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + t.amount
        );
      });

    // Cabeçalhos
    sheet.addRow(["Categoria", "Total Gasto", "Percentual"]);
    sheet.getRow(1).font = { bold: true };

    const total = Array.from(categoryMap.values()).reduce(
      (sum, v) => sum + v,
      0
    );

    // Dados ordenados
    const sortedCategories = Array.from(categoryMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    sortedCategories.forEach(([category, amount]) => {
      sheet.addRow([category, amount, (amount / total) * 100]);
    });

    // Formata
    sheet.getColumn("B").numFmt = "R$ #,##0.00";
    sheet.getColumn("C").numFmt = "0.00%";
  }

  addExcelMonthlyAnalysis(sheet, transactions) {
    // Agrupa por mês
    const monthMap = new Map();

    transactions.forEach((t) => {
      const monthKey = `${t.date.getFullYear()}-${String(
        t.date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { income: 0, expenses: 0 });
      }

      const month = monthMap.get(monthKey);
      if (t.type === "income") {
        month.income += t.amount;
      } else {
        month.expenses += t.amount;
      }
    });

    // Cabeçalhos
    sheet.addRow(["Mês", "Receitas", "Despesas", "Saldo"]);
    sheet.getRow(1).font = { bold: true };

    // Dados ordenados
    const sortedMonths = Array.from(monthMap.entries()).sort();

    sortedMonths.forEach(([month, data]) => {
      sheet.addRow([
        month,
        data.income,
        data.expenses,
        data.income - data.expenses,
      ]);
    });

    // Formata
    sheet.getColumn("B").numFmt = "R$ #,##0.00";
    sheet.getColumn("C").numFmt = "R$ #,##0.00";
    sheet.getColumn("D").numFmt = "R$ #,##0.00";
  }
}

module.exports = new ExportService();
