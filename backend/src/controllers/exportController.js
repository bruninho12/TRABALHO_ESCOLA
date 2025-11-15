/**
 * @fileoverview Controller para Exportação de Dados
 * Gerencia exportação de relatórios e dados do usuário
 */

const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const RecurringTransaction = require("../models/RecurringTransaction");
const exportService = require("../services/exportService");
const { logger } = require("../utils/logger");

class ExportController {
  /**
   * Exporta transações em CSV
   * GET /api/export/transactions/csv
   */
  async exportTransactionsCSV(req, res) {
    try {
      const userId = req.user._id;
      const { startDate, endDate, type, category } = req.query;

      const query = { userId };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
      if (type) query.type = type;
      if (category) query.categoryId = category;

      const transactions = await Transaction.find(query)
        .populate("categoryId", "name")
        .sort({ date: -1 });

      // Gerar relatório Excel (que será usado para ambos)
      const result = await exportService.generateExcelReport(userId, {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      res.download(result.filepath, result.filename, (err) => {
        if (err) {
          logger.error("Error downloading CSV:", err);
        }
      });
    } catch (error) {
      logger.error("Error exporting transactions to CSV:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao exportar transações",
        error: error.message,
      });
    }
  }

  /**
   * Exporta transações em Excel
   * GET /api/export/transactions/excel
   */
  async exportTransactionsExcel(req, res) {
    try {
      const userId = req.user._id;
      const { startDate, endDate, type, category } = req.query;

      const query = { userId };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
      if (type) query.type = type;
      if (category) query.categoryId = category;

      const transactions = await Transaction.find(query)
        .populate("categoryId", "name")
        .sort({ date: -1 });

      const result = await exportService.generateExcelReport(userId, {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      res.download(result.filepath, result.filename, (err) => {
        if (err) {
          logger.error("Error downloading Excel:", err);
        }
      });
    } catch (error) {
      logger.error("Error exporting transactions to Excel:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao exportar transações",
        error: error.message,
      });
    }
  }

  /**
   * Gera relatório mensal em PDF
   * GET /api/export/report/monthly
   */
  async exportMonthlyReport(req, res) {
    try {
      const userId = req.user._id;
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({
          success: false,
          message: "Mês e ano são obrigatórios",
        });
      }

      // Calcular período
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // Buscar transações do período
      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      }).populate("categoryId", "name");

      // Calcular totais
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      // Despesas por categoria
      const expensesByCategory = await Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$categoryId",
            total: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            name: "$category.name",
            total: 1,
            percentage: {
              $multiply: [{ $divide: ["$total", totalExpenses] }, 100],
            },
          },
        },
        {
          $sort: { total: -1 },
        },
      ]);

      // Top transações
      const topTransactions = transactions
        .filter((t) => t.type === "expense")
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      // Gerar PDF usando o novo serviço
      const result = await exportService.generatePDFReport(userId, {
        startDate,
        endDate,
        includeCharts: true,
        includeGoals: true,
        includeBudgets: true,
      });

      res.download(result.filepath, result.filename, (err) => {
        if (err) {
          logger.error("Error downloading PDF:", err);
        }
      });
    } catch (error) {
      logger.error("Error generating monthly report:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao gerar relatório mensal",
        error: error.message,
      });
    }
  }

  /**
   * Exporta metas em PDF
   * GET /api/export/goals/pdf
   */
  async exportGoalsPDF(req, res) {
    try {
      const userId = req.user._id;

      const goals = await Goal.find({ userId }).populate("categoryId", "name");

      // Usar o serviço de exportação genérico
      const result = await exportService.generatePDFReport(userId, {
        includeGoals: true,
        includeBudgets: false,
        includeCharts: false,
      });

      res.download(result.filepath, result.filename, (err) => {
        if (err) {
          logger.error("Error downloading goals PDF:", err);
        }
      });
    } catch (error) {
      logger.error("Error exporting goals to PDF:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao exportar metas",
        error: error.message,
      });
    }
  }

  /**
   * Backup completo dos dados do usuário
   * GET /api/export/backup
   */
  async exportUserBackup(req, res) {
    try {
      const userId = req.user._id;
      const User = require("../models/User");

      // Buscar todos os dados do usuário
      const [user, transactions, goals, recurringTransactions] =
        await Promise.all([
          User.findById(userId).select("-password"),
          Transaction.find({ userId }).populate("categoryId", "name"),
          Goal.find({ userId }).populate("categoryId", "name"),
          RecurringTransaction.find({ userId }).populate("categoryId", "name"),
        ]);

      const userData = {
        user,
        transactions,
        goals,
        recurringTransactions,
        statistics: {
          totalTransactions: transactions.length,
          totalGoals: goals.length,
          totalRecurring: recurringTransactions.length,
          exportDate: new Date(),
        },
      };

      const filename = `backup_${userId}_${Date.now()}.json`;

      // Salvar como JSON
      const fs = require("fs");
      const path = require("path");
      const filepath = path.join(__dirname, "../../exports", filename);

      fs.writeFileSync(filepath, JSON.stringify(userData, null, 2));

      res.download(filepath, filename, (err) => {
        if (err) {
          logger.error("Error downloading backup:", err);
        }
      });
    } catch (error) {
      logger.error("Error exporting user backup:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao criar backup",
        error: error.message,
      });
    }
  }
}

// Criar instância e exportar métodos
const controller = new ExportController();

module.exports = {
  exportTransactionsCSV: controller.exportTransactionsCSV.bind(controller),
  exportTransactionsExcel: controller.exportTransactionsExcel.bind(controller),
  exportMonthlyReport: controller.exportMonthlyReport.bind(controller),
  exportGoalsPDF: controller.exportGoalsPDF.bind(controller),
  exportUserBackup: controller.exportUserBackup.bind(controller),
};
