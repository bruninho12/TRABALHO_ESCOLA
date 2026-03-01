const { Transaction } = require("../models");

// Monta a query de busca de transações a partir da requisição
function buildTransactionQuery(req) {
  const userId = req.user.id || req.user._id;
  const {
    type,
    category,
    startDate,
    endDate,
  } = req.query;

  const query = { userId };

  if (type) query.type = type;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  return query;
}

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "date",
      sortDirection = "desc",
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    const query = buildTransactionQuery(req);
    const sortOrder = sortDirection === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parsedLimit)
        .populate("category"),
      Transaction.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        current: parsedPage,
        pages: Math.ceil(total / parsedLimit) || 1,
        total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar transações",
      error: error.message,
    });
  }
};

// GET /api/transactions/summary
const getTransactionsSummary = async (req, res) => {
  try {
    const query = buildTransactionQuery(req);

    const transactions = await Transaction.find(query);

    const summary = transactions.reduce(
      (acc, tx) => {
        if (tx.type === "income") {
          acc.income += tx.amount;
        } else if (tx.type === "expense") {
          acc.expenses += tx.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );

    return res.status(200).json({
      success: true,
      data: {
        income: summary.income,
        expenses: summary.expenses,
        balance: summary.income - summary.expenses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar resumo de transações",
      error: error.message,
    });
  }
};

// GET /api/transactions/:id
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    }).populate("category");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar transação",
      error: error.message,
    });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { description, amount, date, category, type } = req.body;

    // Validações básicas
    if (!description || !amount || !date || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios faltando",
        details: {
          description: !description ? "Descrição é obrigatória" : null,
          amount: !amount ? "Valor é obrigatório" : null,
          date: !date ? "Data é obrigatória" : null,
          category: !category ? "Categoria é obrigatória" : null,
          type: !type ? "Tipo é obrigatório" : null,
        },
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de transação inválido. Use 'income' ou 'expense'",
      });
    }

    const transaction = new Transaction({
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      type,
      userId,
    });

    await transaction.save();

    return res.status(201).json({
      success: true,
      message: "Transação criada com sucesso",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao criar transação",
      error: error.message,
    });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;
    const { description, amount, date, category, type } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    transaction.description = description ?? transaction.description;
    transaction.amount =
      amount !== undefined ? parseFloat(amount) : transaction.amount;
    transaction.date = date ? new Date(date) : transaction.date;
    transaction.category = category ?? transaction.category;
    transaction.type = type ?? transaction.type;

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transação atualizada com sucesso",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar transação",
      error: error.message,
    });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const transaction = await Transaction.findOne({
      _id: id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada",
      });
    }

    await Transaction.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Transação deletada com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar transação",
      error: error.message,
    });
  }
};

module.exports = {
  getTransactions,
  getTransactionsSummary,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

