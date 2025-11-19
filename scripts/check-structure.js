#!/usr/bin/env node

/**
 * Script de verificação da estrutura do projeto
 * Verifica se todos os arquivos estão nos lugares corretos
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

// Estrutura esperada do projeto
const expectedStructure = {
  "README.md": "file",
  ".gitignore": "file",
  "config/": "directory",
  "config/.env.backend.example": "file",
  "config/.env.frontend.example": "file",
  "docs/": "directory",
  "docs/README.md": "file",
  "docs/guides/": "directory",
  "docs/security/": "directory",
  "docs/checklists/": "directory",
  "docs/development/": "directory",
  "deployment/": "directory",
  "deployment/docker/": "directory",
  "deployment/platforms/": "directory",
  "scripts/": "directory",
  "scripts/deploy/": "directory",
  "backend/": "directory",
  "backend/package.json": "file",
  "backend/server.js": "file",
  "backend/.env.example": "file",
  "backend/src/": "directory",
  "backend/scripts/": "directory",
  "backend/scripts/database/": "directory",
  "backend/scripts/setup/": "directory",
  "backend/logs/": "directory",
  "frontend/": "directory",
  "frontend/package.json": "file",
  "frontend/index.html": "file",
  "frontend/src/": "directory",
  "frontend/src/assets/": "directory",
  "frontend/src/assets/icons/": "directory",
  "frontend/src/assets/images/": "directory",
  "frontend/src/tests/": "directory",
};

function checkStructure() {
  console.log("🔍 Verificando estrutura do projeto...\n");

  let errors = [];
  let warnings = [];
  let success = [];

  for (const [filePath, expectedType] of Object.entries(expectedStructure)) {
    const fullPath = path.join(projectRoot, filePath);

    try {
      const stats = fs.statSync(fullPath);

      if (expectedType === "file" && stats.isFile()) {
        success.push(`✅ ${filePath}`);
      } else if (expectedType === "directory" && stats.isDirectory()) {
        success.push(`✅ ${filePath}`);
      } else {
        errors.push(
          `❌ ${filePath} - Tipo incorreto (esperado: ${expectedType})`
        );
      }
    } catch (err) {
      errors.push(`❌ ${filePath} - Não encontrado`);
    }
  }

  // Verificar arquivos desnecessários na raiz
  const rootFiles = fs.readdirSync(projectRoot);
  const allowedRootItems = [
    "README.md",
    ".gitignore",
    "config",
    "docs",
    "deployment",
    "scripts",
    "backend",
    "frontend",
    ".git",
    "node_modules",
    "package.json",
    "package-lock.json",
  ];

  rootFiles.forEach((item) => {
    if (!allowedRootItems.includes(item)) {
      warnings.push(`⚠️  Arquivo/pasta suspeito na raiz: ${item}`);
    }
  });

  // Exibir resultados
  console.log("✅ ESTRUTURA CORRETA:");
  success.forEach((item) => console.log(`  ${item}`));

  if (warnings.length > 0) {
    console.log("\n⚠️  AVISOS:");
    warnings.forEach((item) => console.log(`  ${item}`));
  }

  if (errors.length > 0) {
    console.log("\n❌ PROBLEMAS ENCONTRADOS:");
    errors.forEach((item) => console.log(`  ${item}`));
    console.log(
      "\n💡 Execute a reorganização novamente para corrigir os problemas."
    );
    process.exit(1);
  }

  console.log("\n🎉 Estrutura do projeto está organizada corretamente!");
  console.log(`📊 Verificados: ${success.length} itens`);
  console.log(`⚠️  Avisos: ${warnings.length}`);
  console.log(`❌ Erros: ${errors.length}`);
}

// Executar verificação
if (require.main === module) {
  checkStructure();
}

module.exports = { checkStructure };
