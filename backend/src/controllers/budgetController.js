const { Budget, Transaction } = require("../models");

// Listar orçamentos do usuário
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.user.id };

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query).populate(
      "category",
      "name type color"
    );
    res.json(budgets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar orçamentos", error: error.message });
  }
};

// Obter progresso dos orçamentos
exports.getBudgetProgress = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Mês e ano são obrigatórios" });
    }

    // Buscar orçamentos
    const budgets = await Budget.find({
      user: req.user.id,
      month: parseInt(month),
      year: parseInt(year),
    }).populate("category", "name type");

    // Calcular gastos reais para cada categoria
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Mapear resultados
    const progress = budgets.map((budget) => {
      const spent = transactions.find(
        (t) => t._id.toString() === budget.category._id.toString()
      );
      return {
        budget: budget.toObject(),
        spent: Math.abs(spent?.total || 0),
        remaining: budget.amount - Math.abs(spent?.total || 0),
        percentage: ((spent?.total || 0) / budget.amount) * 100,
      };
    });

    res.json(progress);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar progresso", error: error.message });
  }
};

// Criar orçamento
exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.user.id,
    });
    await budget.save();

    const populatedBudget = await Budget.findById(budget._id).populate(
      "category",
      "name type color"
    );
    res.status(201).json(populatedBudget);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Já existe um orçamento para esta categoria neste período",
      });
    } else {
      res
        .status(400)
        .json({ message: "Erro ao criar orçamento", error: error.message });
    }
  }
};

// Atualizar orçamento
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate("category", "name type color");

    if (!budget) {
      return res.status(404).json({ message: "Orçamento não encontrado" });
    }

    res.json(budget);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao atualizar orçamento", error: error.message });
  }
};

// Excluir orçamento
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Orçamento não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir orçamento", error: error.message });
  }
};
