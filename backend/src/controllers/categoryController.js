const { Category } = require("../models");
const { AppError } = require("../middleware/errorHandler");

// Listar categorias
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar categorias do usuário
    const categories = await Category.find({ userId }).sort({
      type: 1,
      name: 1,
    });

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Criar categoria
exports.createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type, color, icon, isDefault } = req.body;

    // Verificar se já existe uma categoria com o mesmo nome e tipo
    const existingCategory = await Category.findOne({
      userId,
      name,
      type,
    });

    if (existingCategory) {
      return next(
        new AppError(
          `Já existe uma categoria ${
            type === "income" ? "de receita" : "de despesa"
          } com este nome`,
          400
        )
      );
    }

    // Criar categoria
    const category = new Category({
      name,
      type,
      color: color || getRandomColor(),
      icon,
      isDefault: isDefault || false,
      userId,
    });

    await category.save();

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar categoria
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, color, icon } = req.body;

    // Verificar se a categoria existe e pertence ao usuário
    const category = await Category.findOne({
      _id: id,
      userId,
    });

    if (!category) {
      return next(new AppError("Categoria não encontrada", 404));
    }

    // Verificar se é uma categoria padrão
    if (category.isDefault) {
      return next(
        new AppError("Categorias padrão não podem ser modificadas", 403)
      );
    }

    // Verificar se já existe outra categoria com o mesmo nome e tipo
    if (name) {
      const existingCategory = await Category.findOne({
        userId,
        name,
        type: category.type,
        _id: { $ne: id },
      });

      if (existingCategory) {
        return next(
          new AppError(
            `Já existe uma categoria ${
              category.type === "income" ? "de receita" : "de despesa"
            } com este nome`,
            400
          )
        );
      }
    }

    // Atualizar categoria
    category.name = name || category.name;
    category.color = color || category.color;
    category.icon = icon || category.icon;

    await category.save();

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Excluir categoria
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se a categoria existe e pertence ao usuário
    const category = await Category.findOne({
      _id: id,
      userId,
    });

    if (!category) {
      return next(new AppError("Categoria não encontrada", 404));
    }

    // Verificar se é uma categoria padrão
    if (category.isDefault) {
      return next(
        new AppError("Categorias padrão não podem ser excluídas", 403)
      );
    }

    // Verificar se existem transações associadas
    const Transaction = require("../models/Transaction");
    const transactionCount = await Transaction.countDocuments({
      categoryId: id,
      userId,
    });

    if (transactionCount > 0) {
      return next(
        new AppError(
          `Esta categoria não pode ser excluída pois está associada a ${transactionCount} transações`,
          400
        )
      );
    }

    // Excluir categoria
    await Category.deleteOne({ _id: id, userId });

    res.status(200).json({
      status: "success",
      message: "Categoria excluída com sucesso",
    });
  } catch (error) {
    next(error);
  }
};

// Função auxiliar para gerar uma cor aleatória
const getRandomColor = () => {
  const colors = [
    "#667eea", // Azul
    "#764ba2", // Roxo
    "#10b981", // Verde
    "#ef4444", // Vermelho
    "#f59e0b", // Amarelo
    "#8b5cf6", // Violeta
    "#06b6d4", // Ciano
    "#84cc16", // Verde Limão
    "#f97316", // Laranja
    "#ec4899", // Rosa
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
