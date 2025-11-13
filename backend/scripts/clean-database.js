#!/usr/bin/env node

/**
 * Clean Database Script - Limpa todas as coleções
 * Use com cuidado! Apenas para desenvolvimento!
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const Payment = require('../models/Payment');
const Reward = require('../models/Reward');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/despfinance';

async function cleanDatabase() {
  try {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.error('❌ NÃO PODE LIMPAR BANCO EM PRODUÇÃO!');
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.log('🧹 Iniciando limpeza do banco de dados...');

    // Conectar ao MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // eslint-disable-next-line no-console
    console.log('✅ Conectado ao MongoDB');

    // Limpar coleções
    // eslint-disable-next-line no-console
    console.log('\n🗑️  Limpando coleções...');

    const userCount = await User.countDocuments();
    await User.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`  ✅ Usuários: ${userCount} deletados`);

    const transactionCount = await Transaction.countDocuments();
    await Transaction.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`  ✅ Transações: ${transactionCount} deletadas`);

    const goalCount = await Goal.countDocuments();
    await Goal.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`  ✅ Objetivos: ${goalCount} deletados`);

    const paymentCount = await Payment.countDocuments();
    await Payment.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`  ✅ Pagamentos: ${paymentCount} deletados`);

    const rewardCount = await Reward.countDocuments();
    await Reward.deleteMany({});
    // eslint-disable-next-line no-console
    console.log(`  ✅ Recompensas: ${rewardCount} deletadas`);

    // eslint-disable-next-line no-console
    console.log('\n✅ Banco de dados limpo com sucesso!');
    // eslint-disable-next-line no-console
    console.log('📊 Total de ${userCount + transactionCount + goalCount + paymentCount + rewardCount} documentos removidos');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao limpar banco:', err.message);
    process.exit(1);
  }
}

cleanDatabase();
