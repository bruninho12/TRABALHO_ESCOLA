const { Category } = require("../models");
const { AppError } = require("../middleware/errorHandler");

// Listar categorias
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("🔍 [DEBUG] getCategories - userId:", userId);

    // Buscar categorias do usuário
    let categories = await Category.find({ user: userId }).sort({
      type: 1,
      name: 1,
    });

    console.log("📋 [DEBUG] Categorias encontradas:", categories.length);

    // Se não há categorias, criar categorias padrão
    if (categories.length === 0) {
      console.log("🌱 Criando categorias padrão para o usuário...");
      categories = await createDefaultCategories(userId);
    }

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("❌ [ERROR] getCategories:", error);
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
      user: userId,
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
      user: userId,
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
      user: userId,
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
        user: userId,
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
    await Category.deleteOne({ _id: id, user: userId });

    res.status(200).json({
      status: "success",
      message: "Categoria excluída com sucesso",
    });
  } catch (error) {
    next(error);
  }
};

// Função para criar categorias padrão para um usuário
const createDefaultCategories = async (userId) => {
  console.log("🌱 Criando categorias padrão para usuário:", userId);

  const defaultCategories = [
    // Categorias de receita
    { name: "Salário", type: "income", color: "#10B981", isDefault: true },
    {
      name: "Investimentos",
      type: "income",
      color: "#3B82F6",
      isDefault: true,
    },
    { name: "Freelance", type: "income", color: "#6366F1", isDefault: true },
    { name: "Presentes", type: "income", color: "#EC4899", isDefault: true },
    {
      name: "Outros Receitas",
      type: "income",
      color: "#8B5CF6",
      isDefault: true,
    },

    // Categorias de despesa
    { name: "Alimentação", type: "expense", color: "#EF4444", isDefault: true },
    { name: "Moradia", type: "expense", color: "#F59E0B", isDefault: true },
    { name: "Transporte", type: "expense", color: "#10B981", isDefault: true },
    {
      name: "Entretenimento",
      type: "expense",
      color: "#3B82F6",
      isDefault: true,
    },
    { name: "Saúde", type: "expense", color: "#EC4899", isDefault: true },
    { name: "Educação", type: "expense", color: "#8B5CF6", isDefault: true },
    { name: "Contas", type: "expense", color: "#F97316", isDefault: true },
    { name: "Compras", type: "expense", color: "#06B6D4", isDefault: true },
    {
      name: "Outros Gastos",
      type: "expense",
      color: "#6B7280",
      isDefault: true,
    },
  ];

  try {
    // Criar categorias uma por uma para evitar conflitos
    const createdCategories = [];

    for (const category of defaultCategories) {
      try {
        // Verificar se já existe
        const existing = await Category.findOne({
          name: category.name,
          type: category.type,
          user: userId,
        });

        if (!existing) {
          const newCategory = await Category.create({
            ...category,
            user: userId,
          });
          createdCategories.push(newCategory);
          console.log(
            `✅ Categoria criada: ${category.name} (${category.type})`
          );
        } else {
          console.log(
            `⏭️ Categoria já existe: ${category.name} (${category.type})`
          );
        }
      } catch (error) {
        console.warn(
          `⚠️ Erro ao criar categoria ${category.name}: ${error.message}`
        );
      }
    }

    // Buscar todas as categorias do usuário após criação/verificação
    const allCategories = await Category.find({ user: userId }).sort({
      type: 1,
      name: 1,
    });

    console.log(
      `✅ Verificação concluída: ${allCategories.length} categorias disponíveis`
    );
    return allCategories;
  } catch (error) {
    console.error("❌ Erro ao criar categorias padrão:", error);

    // Em caso de erro, tentar buscar categorias existentes
    try {
      const existingCategories = await Category.find({ user: userId });
      console.log(
        `⚠️ Retornando ${existingCategories.length} categorias existentes`
      );
      return existingCategories;
    } catch (fallbackError) {
      console.error("❌ Erro crítico ao buscar categorias:", fallbackError);
      throw error;
    }
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
