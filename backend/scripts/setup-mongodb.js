#!/usr/bin/env node

/**
 * Setup Script para MongoDB Integration
 * Verifica conexão com MongoDB e cria índices
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const Payment = require('../models/Payment');
const Reward = require('../models/Reward');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/despfinance';

async function setupDatabase() {
  try {
    console.log('🔄 Iniciando setup do MongoDB...');
    console.log(`📍 URI: ${mongoUri}`);

    // Conectar ao MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB com sucesso!');

    // Criar índices
    console.log('\n📑 Criando índices...');

    await User.collection.createIndex({ email: 1 });
    console.log('  ✅ Index: User.email');

    await User.collection.createIndex({ username: 1 });
    console.log('  ✅ Index: User.username');

    await Transaction.collection.createIndex({ userId: 1, date: -1 });
    console.log('  ✅ Index: Transaction.userId + date');

    await Goal.collection.createIndex({ userId: 1, status: 1 });
    console.log('  ✅ Index: Goal.userId + status');

    await Payment.collection.createIndex({ userId: 1, createdAt: -1 });
    console.log('  ✅ Index: Payment.userId + createdAt');

    await Reward.collection.createIndex({ userId: 1, unlockedAt: -1 });
    console.log('  ✅ Index: Reward.userId + unlockedAt');

    console.log('\n📊 Coleções e contagens:');

    const userCount = await User.countDocuments();
    console.log(`  👥 Users: ${userCount}`);

    const transactionCount = await Transaction.countDocuments();
    console.log(`  💳 Transactions: ${transactionCount}`);

    const goalCount = await Goal.countDocuments();
    console.log(`  🎯 Goals: ${goalCount}`);

    const paymentCount = await Payment.countDocuments();
    console.log(`  💰 Payments: ${paymentCount}`);

    const rewardCount = await Reward.countDocuments();
    console.log(`  🏆 Rewards: ${rewardCount}`);

    console.log('\n✅ Setup do MongoDB concluído com sucesso!');
    console.log('\n🚀 Agora você pode executar: npm run dev');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante setup:', err.message);
    console.error('\n💡 Dicas:');
    console.error('  - Verifique se MongoDB está rodando: mongod');
    console.error('  - Se usar MongoDB Atlas, atualize MONGODB_URI no .env');
    console.error('  - Verifique as credenciais de conexão');
    process.exit(1);
  }
}

setupDatabase();
