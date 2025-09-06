// Este arquivo é um redirecionador para acomodar a duplicação de path no Render
// Quando o Render tenta executar 'node backend/index_render.js', ele procura em '/backend/backend/index_render.js'
// Este arquivo resolve esse problema específico

console.log("Redirecionando para o index.js correto...");

// Voltar dois diretórios para chegar à raiz do projeto
const path = require("path");
const projectRoot = path.resolve(__dirname, "../..");
const mainFile = path.join(projectRoot, "backend", "index.js");

console.log(`Tentando executar: ${mainFile}`);

// Usando require para CommonJS
try {
  // Primeiro tentamos com require (CommonJS)
  console.log("Tentando carregar com require...");
  require(mainFile);
} catch (error) {
  if (error.code === "ERR_REQUIRE_ESM") {
    console.log(
      "Arquivo é um ES Module, usando child_process para executar..."
    );

    // Se falhar porque o arquivo é ESM, usamos child_process
    const { spawnSync } = require("child_process");
    const result = spawnSync("node", [mainFile], {
      stdio: "inherit",
      cwd: projectRoot,
    });

    process.exit(result.status);
  } else {
    // Se for outro erro, mostramos e encerramos
    console.error("Erro ao carregar arquivo:", error);
    process.exit(1);
  }
}
