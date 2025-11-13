const mongoose = require('mongoose');
const logger = require('../utils/logger');

class DatabaseConnection {
  static async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/despfinance';
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      logger.info(`🔄 Conectando ao MongoDB: ${mongoUri}`);

      await mongoose.connect(mongoUri, options);

      logger.info('✅ Conexão com MongoDB estabelecida com sucesso');

      // Event listeners
      mongoose.connection.on('connected', () => {
        logger.info('📦 Mongoose conectado ao banco de dados');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('❌ Erro na conexão do Mongoose:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('⚠️ Mongoose foi desconectado');
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('🛑 Mongoose desconectado devido ao encerramento do processo');
        process.exit(0);
      });

      return mongoose.connection;
    } catch (err) {
      logger.error('❌ Falha ao conectar ao MongoDB:', err);
      throw err;
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info('✅ Desconectado do MongoDB');
    } catch (err) {
      logger.error('❌ Erro ao desconectar do MongoDB:', err);
      throw err;
    }
  }

  static isConnected() {
    return mongoose.connection.readyState === 1;
  }

  static getConnection() {
    return mongoose.connection;
  }
}

module.exports = DatabaseConnection;
