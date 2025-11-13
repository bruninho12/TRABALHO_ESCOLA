#!/usr/bin/env node

/**
 * Seed Script - Popula o banco com dados de teste
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const Payment = require('../models/Payment');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/despfinance';

// Dados de teste
const testUsers = [
  {
    email: 'bruno@despfinance.com',
    username: 'bruno',
    password: 'Senha@123456',
    fullName: 'Bruno Souza',
    level: 5,
    experience: 500,
    score: 250,
    coins: 1500,
  },
  {
    email: 'maria@despfinance.com',
    username: 'maria',
    password: 'Senha@123456',
    fullName: 'Maria Silva',
    level: 3,
    experience: 250,
    score: 100,
    coins: 750,
  },
  {
    email: 'joao@despfinance.com',
    username: 'joao',
    password: 'Senha@123456',
    fullName: 'João Santos',
    level: 2,
    experience: 100,
    score: 50,
    coins: 250,
  },
];

const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Entretenimento'];

async function seedDatabase() {
  try {
    // eslint-disable-next-line no-console
    console.log('🌱 Iniciando população do banco de dados...');

    // Conectar ao MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // eslint-disable-next-line no-console
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes (apenas em desenvolvimento!)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('🗑️  Limpando dados existentes...');
      await User.deleteMany({});
      await Transaction.deleteMany({});
      await Goal.deleteMany({});
      await Payment.deleteMany({});
    }

    // Criar usuários de teste
    // eslint-disable-next-line no-console
    console.log('👥 Criando usuários de teste...');
    const users = [];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      // eslint-disable-next-line no-console
      console.log(`  ✅ Usuário criado: ${user.email}`);
    }

    // Criar transações de teste
    // eslint-disable-next-line no-console
    console.log('💳 Criando transações de teste...');
    for (const user of users) {
      for (let i = 0; i < 5; i += 1) {
        const transaction = new Transaction({
          userId: user._id,
          type: ['expense', 'income'][Math.floor(Math.random() * 2)],
          category: categories[Math.floor(Math.random() * categories.length)],
          amount: Math.floor(Math.random() * 1000) + 50,
          description: `Transação de teste ${i + 1}`,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        });
        await transaction.save();
      }
      // eslint-disable-next-line no-console
      console.log(`  ✅ 5 transações criadas para ${user.email}`);
    }

    // Criar objetivos de teste
    // eslint-disable-next-line no-console
    console.log('🎯 Criando objetivos de teste...');
    for (const user of users) {
      const goal = new Goal({
        userId: user._id,
        name: 'Economizar para viagem',
        category: 'Viagem',
        targetAmount: 5000,
        currentAmount: Math.floor(Math.random() * 5000),
        priority: 'high',
        status: 'active',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        description: 'Objetivo de teste para economizar dinheiro',
      });
      await goal.save();

      // Adicionar milestones
      goal.milestones = [
        { name: '25%', targetAmount: 1250 },
        { name: '50%', targetAmount: 2500 },
        { name: '75%', targetAmount: 3750 },
      ];
      await goal.save();

      // eslint-disable-next-line no-console
      console.log(`  ✅ Objetivo criado para ${user.email}`);
    }

    // Criar pagamentos de teste
    // eslint-disable-next-line no-console
    console.log('💰 Criando pagamentos de teste...');
    for (const user of users) {
      const payment = new Payment({
        userId: user._id,
        type: 'subscription',
        status: 'completed',
        amount: 99.99,
        currency: 'BRL',
        paymentMethod: 'stripe',
        description: 'Assinatura Premium DespFinance',
        externalId: `ext_${Date.now()}_${Math.random()}`,
        item: {
          type: 'premium_subscription',
          name: 'DespFinance Premium',
          quantity: 1,
        },
      });
      await payment.save();
      // eslint-disable-next-line no-console
      console.log(`  ✅ Pagamento criado para ${user.email}`);
    }

    // Exibir estatísticas
    // eslint-disable-next-line no-console
    console.log('\n📊 Estatísticas Finais:');

    const userCount = await User.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    const goalCount = await Goal.countDocuments();
    const paymentCount = await Payment.countDocuments();

    // eslint-disable-next-line no-console
    console.log(`  👥 Usuários: ${userCount}`);
    // eslint-disable-next-line no-console
    console.log(`  💳 Transações: ${transactionCount}`);
    // eslint-disable-next-line no-console
    console.log(`  🎯 Objetivos: ${goalCount}`);
    // eslint-disable-next-line no-console
    console.log(`  💰 Pagamentos: ${paymentCount}`);

    // eslint-disable-next-line no-console
    console.log('\n✅ Banco de dados populado com sucesso!');
    // eslint-disable-next-line no-console
    console.log('🚀 Agora você pode executar: npm run dev');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao popular banco:', err.message);
    process.exit(1);
  }
}

seedDatabase();
