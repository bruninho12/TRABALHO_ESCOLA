/**
 * Script para criar categorias padrão para um usuário específico
 * Execute: node create-categories.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Importar modelos
const Category = require("./src/models/Category");

async function createCategoriesForUser() {
  try {
    // Conectar ao banco
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://brunoblack098:sB7s9s3TVCgvOO5a@cluster0.vwaf6ka.mongodb.net/testedespfinancereact?retryWrites=true&w=majority"
    );
    console.log("✅ Conectado ao MongoDB");

    // ID do usuário demo (substitua pelo ID real)
    const userId = "691527249d21a2fae6aa8050";

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
      {
        name: "Alimentação",
        type: "expense",
        color: "#EF4444",
        isDefault: true,
      },
      { name: "Moradia", type: "expense", color: "#F59E0B", isDefault: true },
      {
        name: "Transporte",
        type: "expense",
        color: "#10B981",
        isDefault: true,
      },
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

    let createdCount = 0;
    let existingCount = 0;

    for (const category of defaultCategories) {
      try {
        // Verificar se já existe
        const existing = await Category.findOne({
          name: category.name,
          type: category.type,
          user: userId,
        });

        if (!existing) {
          await Category.create({
            ...category,
            user: userId,
          });
          console.log(`✅ Criada: ${category.name} (${category.type})`);
          createdCount++;
        } else {
          console.log(`⏭️ Já existe: ${category.name} (${category.type})`);
          existingCount++;
        }
      } catch (error) {
        console.error(`❌ Erro ao criar ${category.name}:`, error.message);
      }
    }

    // Listar todas as categorias do usuário
    const allCategories = await Category.find({ user: userId }).sort({
      type: 1,
      name: 1,
    });

    console.log("\n📋 RESUMO:");
    console.log(`✅ Criadas: ${createdCount}`);
    console.log(`⏭️ Já existiam: ${existingCount}`);
    console.log(`📊 Total de categorias: ${allCategories.length}`);

    console.log("\n📋 CATEGORIAS DISPONÍVEIS:");
    allCategories.forEach((cat) => {
      console.log(
        `  ${cat.type === "income" ? "💰" : "💸"} ${cat.name} (${cat.type})`
      );
    });

    await mongoose.disconnect();
    console.log("\n✅ Script executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

createCategoriesForUser();
