/**
 * @fileoverview Ponto de entrada principal para os utilitários do sistema
 * Este arquivo exporta todas as funções utilitárias de forma organizada
 */

// Importar utilitários de banco de dados
const connectionTester = require("./database/connectionTester");

// Importar utilitários de validação
const validationSchemas = require("./validation/validationSchemas");
const configValidator = require("./validation/configValidator");

// Importar utilitários de manutenção
const demoUserManager = require("./maintenance/demoUserManager");

// Importar logger
const logger = require("./logger");

// Exportar todos os utilitários de forma organizada
module.exports = {
  // Logger
  logger,

  // Database
  db: {
    testConnection: connectionTester.testConnection,
    testLocalConnection: connectionTester.testLocalConnection,
    testAtlasConnection: connectionTester.testAtlasConnection,
    printSafeUri: connectionTester.printSafeUri,
  },

  // Validation
  validation: {
    schemas: validationSchemas,
    config: {
      check: configValidator.checkEnvironmentConfig,
      printReport: configValidator.printConfigReport,
    },
  },

  // Maintenance
  maintenance: {
    demoUser: {
      check: demoUserManager.checkDemoUser,
      create: demoUserManager.createDemoUser,
      reset: demoUserManager.resetDemoPassword,
      manage: demoUserManager.manageDemoUser,
    },
  },
};
