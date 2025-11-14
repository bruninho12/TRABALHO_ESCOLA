/**
 * @fileoverview Sistema de Exportação de Dados
 * Gera relatórios em PDF e exporta dados em CSV/Excel
 */

const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

class DataExporter {
  constructor() {
    this.exportDir = path.join(__dirname, "../../exports");
    this.ensureExportDir();
  }

  /**
   * Garante que o diretório de exportação existe
   */
  ensureExportDir() {
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  /**
   * Exporta transações para CSV
   */
  async exportTransactionsToCSV(transactions, filename = "transactions.csv") {
    try {
      const fields = [
        { label: "Data", value: "date" },
        { label: "Descrição", value: "description" },
        { label: "Tipo", value: "type" },
        { label: "Categoria", value: "category" },
        { label: "Valor", value: "amount" },
        { label: "Método de Pagamento", value: "paymentMethod" },
        { label: "Notas", value: "notes" },
      ];

      const data = transactions.map((t) => ({
        date: this.formatDate(t.date),
        description: t.description,
        type: t.type === "income" ? "Receita" : "Despesa",
        category: t.categoryId?.name || "N/A",
        amount: this.formatCurrency(t.amount),
        paymentMethod: t.paymentMethod || "N/A",
        notes: t.notes || "",
      }));

      const parser = new Parser({ fields, delimiter: ";" });
      const csv = parser.parse(data);

      const filepath = path.join(this.exportDir, filename);
      fs.writeFileSync(filepath, "\uFEFF" + csv); // BOM para UTF-8

      logger.info(`CSV exported: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error("Error exporting to CSV:", error);
      throw error;
    }
  }

  /**
   * Exporta transações para Excel
   */
  async exportTransactionsToExcel(
    transactions,
    filename = "transactions.xlsx"
  ) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transações");

      // Definir colunas
      worksheet.columns = [
        { header: "Data", key: "date", width: 12 },
        { header: "Descrição", key: "description", width: 30 },
        { header: "Tipo", key: "type", width: 10 },
        { header: "Categoria", key: "category", width: 20 },
        { header: "Valor", key: "amount", width: 15 },
        { header: "Método", key: "paymentMethod", width: 15 },
        { header: "Notas", key: "notes", width: 30 },
      ];

      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" },
      };

      // Adicionar dados
      transactions.forEach((t) => {
        const row = worksheet.addRow({
          date: this.formatDate(t.date),
          description: t.description,
          type: t.type === "income" ? "Receita" : "Despesa",
          category: t.categoryId?.name || "N/A",
          amount: t.amount,
          paymentMethod: t.paymentMethod || "N/A",
          notes: t.notes || "",
        });

        // Colorir linha baseado no tipo
        row.getCell("type").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: t.type === "income" ? "FFE8F5E9" : "FFFFEBEE",
          },
        };

        // Formatar valor
        row.getCell("amount").numFmt = "R$ #,##0.00";
      });

      // Adicionar totais
      const totalRow = worksheet.addRow({
        date: "",
        description: "TOTAL",
        type: "",
        category: "",
        amount: {
          formula: `SUM(E2:E${transactions.length + 1})`,
        },
        paymentMethod: "",
        notes: "",
      });
      totalRow.font = { bold: true };

      const filepath = path.join(this.exportDir, filename);
      await workbook.xlsx.writeFile(filepath);

      logger.info(`Excel exported: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  /**
   * Gera relatório mensal em PDF
   */
  async generateMonthlyReportPDF(data, filename = "monthly-report.pdf") {
    try {
      const filepath = path.join(this.exportDir, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Cabeçalho
      this.addPDFHeader(doc, "Relatório Mensal - DespFinancee");

      // Período
      doc
        .fontSize(12)
        .text(
          `Período: ${this.formatDate(data.startDate)} a ${this.formatDate(
            data.endDate
          )}`,
          { align: "center" }
        );

      doc.moveDown();

      // Resumo Financeiro
      this.addPDFSection(doc, "Resumo Financeiro");

      const summary = [
        ["Total de Receitas:", this.formatCurrency(data.totalIncome)],
        ["Total de Despesas:", this.formatCurrency(data.totalExpenses)],
        ["Saldo:", this.formatCurrency(data.totalIncome - data.totalExpenses)],
      ];

      this.addPDFTable(doc, summary);

      doc.moveDown();

      // Despesas por Categoria
      if (data.expensesByCategory && data.expensesByCategory.length > 0) {
        this.addPDFSection(doc, "Despesas por Categoria");

        const categoryData = data.expensesByCategory.map((cat) => [
          cat.name,
          this.formatCurrency(cat.total),
          `${cat.percentage.toFixed(1)}%`,
        ]);

        this.addPDFTable(doc, categoryData, [
          "Categoria",
          "Valor",
          "% do Total",
        ]);
      }

      doc.moveDown();

      // Top 10 Transações
      if (data.topTransactions && data.topTransactions.length > 0) {
        this.addPDFSection(doc, "Maiores Transações");

        const transData = data.topTransactions
          .slice(0, 10)
          .map((t) => [
            this.formatDate(t.date),
            t.description.substring(0, 30),
            this.formatCurrency(t.amount),
          ]);

        this.addPDFTable(doc, transData, ["Data", "Descrição", "Valor"]);
      }

      // Rodapé
      doc
        .fontSize(8)
        .text(
          `Gerado em ${new Date().toLocaleString("pt-BR")}`,
          50,
          doc.page.height - 50,
          { align: "center" }
        );

      doc.end();

      await new Promise((resolve) => stream.on("finish", resolve));

      logger.info(`PDF report generated: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error("Error generating PDF report:", error);
      throw error;
    }
  }

  /**
   * Exporta dados completos do usuário (backup)
   */
  async exportUserDataBackup(userData, filename = "user-backup.json") {
    try {
      const filepath = path.join(this.exportDir, filename);

      const backup = {
        exportedAt: new Date().toISOString(),
        version: "2.0.0",
        user: {
          id: userData.user._id,
          name: userData.user.name,
          email: userData.user.email,
        },
        data: {
          transactions: userData.transactions || [],
          goals: userData.goals || [],
          budgets: userData.budgets || [],
          categories: userData.categories || [],
          recurringTransactions: userData.recurringTransactions || [],
        },
        statistics: userData.statistics || {},
      };

      fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), "utf8");

      logger.info(`User backup exported: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error("Error exporting user backup:", error);
      throw error;
    }
  }

  /**
   * Exporta metas para PDF
   */
  async exportGoalsToPDF(goals, filename = "goals-report.pdf") {
    try {
      const filepath = path.join(this.exportDir, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      this.addPDFHeader(doc, "Relatório de Metas");

      doc.fontSize(12).text(`Total de Metas: ${goals.length}`, {
        align: "center",
      });

      doc.moveDown();

      // Estatísticas
      const completed = goals.filter((g) => g.status === "completed").length;
      const active = goals.filter((g) => g.status === "active").length;
      const totalProgress =
        goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length;

      this.addPDFSection(doc, "Estatísticas");

      const stats = [
        ["Metas Ativas:", active.toString()],
        ["Metas Completadas:", completed.toString()],
        ["Progresso Médio:", `${totalProgress.toFixed(1)}%`],
      ];

      this.addPDFTable(doc, stats);

      doc.moveDown();

      // Lista de metas
      this.addPDFSection(doc, "Suas Metas");

      goals.forEach((goal, index) => {
        if (index > 0) doc.moveDown(0.5);

        doc.fontSize(11).font("Helvetica-Bold").text(goal.name);

        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Categoria: ${goal.category}`)
          .text(`Valor Alvo: ${this.formatCurrency(goal.targetAmount)}`)
          .text(`Atual: ${this.formatCurrency(goal.currentAmount || 0)}`)
          .text(`Progresso: ${(goal.progress || 0).toFixed(1)}%`)
          .text(`Prazo: ${this.formatDate(goal.deadline)}`)
          .text(`Status: ${this.translateStatus(goal.status)}`);
      });

      doc.end();
      await new Promise((resolve) => stream.on("finish", resolve));

      logger.info(`Goals PDF exported: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error("Error exporting goals to PDF:", error);
      throw error;
    }
  }

  // ==================== Métodos Auxiliares para PDF ====================

  addPDFHeader(doc, title) {
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(title, { align: "center" })
      .moveDown();
  }

  addPDFSection(doc, title) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(title)
      .moveDown(0.5)
      .strokeColor("#4CAF50")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()
      .moveDown();
  }

  addPDFTable(doc, data, headers = null) {
    const startX = 50;
    let startY = doc.y;
    const columnWidth =
      (doc.page.width - 100) / (headers?.length || data[0].length);

    // Headers
    if (headers) {
      doc.font("Helvetica-Bold").fontSize(10);
      headers.forEach((header, i) => {
        doc.text(header, startX + i * columnWidth, startY, {
          width: columnWidth,
          align: "left",
        });
      });
      startY += 20;
      doc.font("Helvetica");
    }

    // Data rows
    data.forEach((row, rowIndex) => {
      const y = startY + rowIndex * 20;

      row.forEach((cell, colIndex) => {
        doc.fontSize(9).text(cell, startX + colIndex * columnWidth, y, {
          width: columnWidth,
          align: colIndex === row.length - 1 ? "right" : "left",
        });
      });
    });

    doc.moveDown(data.length * 0.3);
  }

  // ==================== Métodos Utilitários ====================

  formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  translateStatus(status) {
    const translations = {
      active: "Ativa",
      completed: "Completada",
      paused: "Pausada",
      cancelled: "Cancelada",
    };
    return translations[status] || status;
  }

  /**
   * Limpa arquivos de exportação antigos
   */
  async cleanOldExports(daysOld = 7) {
    try {
      const files = fs.readdirSync(this.exportDir);
      const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;
      let deleted = 0;

      files.forEach((file) => {
        const filepath = path.join(this.exportDir, file);
        const stats = fs.statSync(filepath);

        if (stats.mtimeMs < cutoffDate) {
          fs.unlinkSync(filepath);
          deleted++;
        }
      });

      logger.info(`Cleaned ${deleted} old export files`);
      return deleted;
    } catch (error) {
      logger.error("Error cleaning old exports:", error);
      throw error;
    }
  }

  /**
   * Obtém caminho do arquivo de exportação
   */
  getExportPath(filename) {
    return path.join(this.exportDir, filename);
  }
}

// Singleton
const dataExporter = new DataExporter();

module.exports = {
  DataExporter,
  dataExporter,
};
