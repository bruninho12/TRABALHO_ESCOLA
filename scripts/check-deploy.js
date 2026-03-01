#!/usr/bin/env node

/**
 * Script de verificação pré-deploy
 * Valida se o projeto está pronto para publicação
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.magenta}${msg}${colors.reset}\n`),
};

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    log.success(`${description} existe`);
    checks.passed++;
    return true;
  } else {
    log.error(`${description} NÃO encontrado: ${filePath}`);
    checks.failed++;
    return false;
  }
}

function checkEnvVariables(envPath, requiredVars) {
  const fullPath = path.join(__dirname, "..", envPath);

  if (!fs.existsSync(fullPath)) {
    log.error(`Arquivo ${envPath} não encontrado`);
    checks.failed++;
    return false;
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  let allFound = true;

  requiredVars.forEach((varName) => {
    if (content.includes(`${varName}=`)) {
      const value = content.match(new RegExp(`${varName}=(.*)`))?.[1]?.trim();

      // Verificar se não está vazio ou com valor de exemplo
      if (
        !value ||
        value === "" ||
        value.includes("your_") ||
        value.includes("sua_") ||
        value.includes("exemplo") ||
        value.includes("example")
      ) {
        log.warning(`${varName} está com valor de exemplo`);
        checks.warnings++;
      } else {
        log.success(`${varName} configurado`);
        checks.passed++;
      }
    } else {
      log.error(`${varName} não encontrado em ${envPath}`);
      checks.failed++;
      allFound = false;
    }
  });

  return allFound;
}

function runCommand(command, description, cwd = null) {
  try {
    log.info(`Executando: ${description}...`);
    const options = cwd
      ? { cwd: path.join(__dirname, "..", cwd), stdio: "pipe" }
      : { stdio: "pipe" };
    execSync(command, options);
    log.success(description);
    checks.passed++;
    return true;
  } catch (error) {
    log.error(`${description} falhou`);
    if (error.stdout) {
      console.log(error.stdout.toString());
    }
    if (error.stderr) {
      console.error(error.stderr.toString());
    }
    checks.failed++;
    return false;
  }
}

function checkPackageJson(packagePath, checks) {
  const fullPath = path.join(__dirname, "..", packagePath);

  if (!fs.existsSync(fullPath)) {
    log.error(`${packagePath} não encontrado`);
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  checks.forEach((check) => {
    const { field, description } = check;
    const value = field.split(".").reduce((obj, key) => obj?.[key], pkg);

    if (value) {
      log.success(`${description}: ${value}`);
    } else {
      log.warning(`${description} não encontrado`);
    }
  });
}

// ============================================
// INÍCIO DAS VERIFICAÇÕES
// ============================================

console.log(`
╔═══════════════════════════════════════════╗
║   🚀 VERIFICAÇÃO PRÉ-DEPLOY              ║
║   DespFinancee v2.0                       ║
╚═══════════════════════════════════════════╝
`);

// 1. ARQUIVOS ESSENCIAIS
log.title("📁 1. ARQUIVOS ESSENCIAIS");
checkFileExists("LICENSE", "LICENSE");
checkFileExists("README.md", "README.md");
checkFileExists("CHANGELOG.md", "CHANGELOG.md");
checkFileExists("CONTRIBUTING.md", "CONTRIBUTING.md");
checkFileExists(".gitignore", ".gitignore");

// 2. DOCUMENTAÇÃO
log.title("📚 2. DOCUMENTAÇÃO");
checkFileExists("CHECKLIST_PUBLICACAO.md", "Checklist de Publicação");
checkFileExists("DEPLOY_GUIDE.md", "Guia de Deploy");
checkFileExists("docs/guides/SETUP_GUIDE.md", "Guia de Setup");
checkFileExists("docs/security/SECURITY_GUIDE.md", "Guia de Segurança");

// 3. ESTRUTURA DE PASTAS
log.title("📂 3. ESTRUTURA DO PROJETO");
checkFileExists("backend/package.json", "Backend package.json");
checkFileExists("frontend/package.json", "Frontend package.json");
checkFileExists("backend/server.js", "Backend server.js");
checkFileExists("frontend/index.html", "Frontend index.html");

// 4. CI/CD
log.title("🔄 4. CI/CD");
checkFileExists(".github/workflows/ci.yml", "GitHub Actions CI");
checkFileExists(".github/workflows/deploy.yml", "GitHub Actions Deploy");

// 5. DOCKER
log.title("🐳 5. DOCKER");
checkFileExists("deployment/docker/docker-compose.yml", "Docker Compose");
checkFileExists("deployment/docker/Dockerfile.backend", "Dockerfile Backend");
checkFileExists("deployment/docker/Dockerfile.frontend", "Dockerfile Frontend");

// 6. CONFIGURAÇÕES BACKEND
log.title("⚙️ 6. BACKEND - Package.json");
checkPackageJson("backend/package.json", [
  { field: "name", description: "Nome" },
  { field: "version", description: "Versão" },
  { field: "description", description: "Descrição" },
  { field: "scripts.start", description: "Script start" },
  { field: "scripts.dev", description: "Script dev" },
]);

// 7. CONFIGURAÇÕES FRONTEND
log.title("🎨 7. FRONTEND - Package.json");
checkPackageJson("frontend/package.json", [
  { field: "name", description: "Nome" },
  { field: "version", description: "Versão" },
  { field: "scripts.build", description: "Script build" },
  { field: "scripts.dev", description: "Script dev" },
]);

// 8. VARIÁVEIS DE AMBIENTE
log.title("🔐 8. VARIÁVEIS DE AMBIENTE (Exemplos)");
checkFileExists("config/.env.backend.example", "Backend .env.example");
checkFileExists("config/.env.frontend.example", "Frontend .env.example");

log.info("Verificando variáveis obrigatórias no .env.example...");
const backendRequiredVars = [
  "NODE_ENV",
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "CORS_ORIGIN",
];

checkEnvVariables("config/.env.backend.example", backendRequiredVars);

// 9. LINT E BUILD
log.title("🔍 9. QUALIDADE DE CÓDIGO");

// Backend
log.info("Verificando Backend...");
if (fs.existsSync(path.join(__dirname, "..", "backend", "node_modules"))) {
  runCommand("npm run lint", "Backend: Lint", "backend");
} else {
  log.warning(
    "Backend node_modules não encontrado. Execute: cd backend && npm install"
  );
  checks.warnings++;
}

// Frontend
log.info("Verificando Frontend...");
if (fs.existsSync(path.join(__dirname, "..", "frontend", "node_modules"))) {
  runCommand("npm run lint", "Frontend: Lint", "frontend");
  runCommand("npm run build", "Frontend: Build", "frontend");
} else {
  log.warning(
    "Frontend node_modules não encontrado. Execute: cd frontend && npm install"
  );
  checks.warnings++;
}

// 10. SEGURANÇA
log.title("🛡️ 10. SEGURANÇA");

log.info("Verificando vulnerabilidades do Frontend...");
if (fs.existsSync(path.join(__dirname, "..", "frontend", "node_modules"))) {
  const result = runCommand(
    "npm audit --production --audit-level=moderate",
    "Frontend: Audit de segurança",
    "frontend"
  );

  if (!result) {
    log.warning(
      "Vulnerabilidades encontradas no Frontend (verifique manualmente)"
    );
  }
}

log.info("Verificando vulnerabilidades do Backend...");
if (fs.existsSync(path.join(__dirname, "..", "backend", "node_modules"))) {
  const result = runCommand(
    "npm audit --production --audit-level=moderate",
    "Backend: Audit de segurança",
    "backend"
  );

  if (!result) {
    log.warning(
      "Vulnerabilidades encontradas no Backend (algumas podem ser de dev)"
    );
  }
}

// ============================================
// RELATÓRIO FINAL
// ============================================

log.title("📊 RELATÓRIO FINAL");

const total = checks.passed + checks.failed + checks.warnings;
const successRate = ((checks.passed / total) * 100).toFixed(1);

console.log(`
┌─────────────────────────────────────┐
│  Verificações Passadas:  ${colors.green}${checks.passed
  .toString()
  .padStart(3)}${colors.reset}     │
│  Verificações Falhas:    ${colors.red}${checks.failed
  .toString()
  .padStart(3)}${colors.reset}     │
│  Avisos:                 ${colors.yellow}${checks.warnings
  .toString()
  .padStart(3)}${colors.reset}     │
│  Total:                  ${total.toString().padStart(3)}      │
│  Taxa de Sucesso:        ${successRate}%   │
└─────────────────────────────────────┘
`);

if (checks.failed === 0 && checks.warnings === 0) {
  log.success("🎉 PROJETO 100% PRONTO PARA PUBLICAÇÃO!");
  console.log("\n📋 Próximos passos:");
  console.log("   1. Revise: CHECKLIST_PUBLICACAO.md");
  console.log("   2. Siga: DEPLOY_GUIDE.md");
  console.log("   3. Deploy! 🚀\n");
  process.exit(0);
} else if (checks.failed === 0) {
  log.warning("⚠️  PROJETO QUASE PRONTO! Alguns avisos encontrados.");
  console.log("\n📋 Recomendações:");
  console.log("   1. Revise os avisos acima");
  console.log("   2. Configure variáveis de ambiente de produção");
  console.log("   3. Siga: DEPLOY_GUIDE.md\n");
  process.exit(0);
} else {
  log.error("❌ PROJETO NÃO ESTÁ PRONTO!");
  console.log("\n📋 Ações necessárias:");
  console.log("   1. Corrija os erros acima");
  console.log("   2. Execute novamente: npm run check:deploy");
  console.log("   3. Revise: CHECKLIST_PUBLICACAO.md\n");
  process.exit(1);
}
