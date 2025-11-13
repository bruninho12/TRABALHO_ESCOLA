#!/usr/bin/env node

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const WorldMap = require('../models/WorldMap');
const { CITIES_TEMPLATES } = require('../models/WorldMap');
const { ACHIEVEMENT_TEMPLATES } = require('../models/Achievement');
const logger = require('../utils/logger');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/despfinance';

async function setupRPGSystem() {
  try {
    logger.info('🚀 Iniciando setup do sistema RPG...');

    // Connect to database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ Conectado ao MongoDB');

    // ========================================
    // SETUP WORLD MAP
    // ========================================
    logger.info('📍 Configurando Mapa do Mundo...');

    // Clear existing cities
    await WorldMap.deleteMany({});
    logger.info('🧹 Cidades anteriores removidas');

    // Insert cities
    const citiesArray = Object.values(CITIES_TEMPLATES);
    await WorldMap.insertMany(citiesArray);
    logger.info(`✅ ${citiesArray.length} cidades criadas com sucesso!`);

    // List created cities
    const cities = await WorldMap.find().select('cityNumber name difficulty');
    logger.info('\n🏙️  Cidades do Mundo:');
    cities.forEach(city => {
      logger.info(`   ${city.cityNumber}. ${city.name} (${city.difficulty})`);
    });

    // ========================================
    // SETUP ACHIEVEMENTS
    // ========================================
    logger.info('\n🏆 Configurando Achievements...');

    // Clear existing achievements (global, não por usuário)
    // Vamos deixar os existentes e apenas log

    const achievementCount = Object.keys(ACHIEVEMENT_TEMPLATES).length;
    logger.info(`📊 ${achievementCount} achievement templates disponíveis`);

    // Display templates
    logger.info('\n🎯 Templates de Achievements:');
    Object.values(ACHIEVEMENT_TEMPLATES).forEach((template) => {
      logger.info(`   ${template.icon} ${template.name} - ${template.category}`);
    });

    // ========================================
    // SUMMARY
    // ========================================
    logger.info('\n' + '='.repeat(50));
    logger.info('✨ RPG SYSTEM SETUP COMPLETO! ✨');
    logger.info('='.repeat(50));

    logger.info('\n📋 Resumo:');
    logger.info(`   • Cidades do Mundo: ${citiesArray.length}`);
    logger.info(`   • Achievement Templates: ${achievementCount}`);
    logger.info(`   • Status: ✅ PRONTO PARA PRODUÇÃO`);

    logger.info('\n🎮 Próximos passos:');
    logger.info('   1. Os usuários podem criar avatares');
    logger.info('   2. Batalhas começam na Cidade 1');
    logger.info('   3. Progressão desbloqueada ao derrotar bosses');
    logger.info('   4. Achievements ganhos com milestones');

    logger.info('\n📚 Documentação:');
    logger.info('   • Avatares: POST /api/rpg/avatar');
    logger.info('   • Batalhas: POST /api/rpg/battle/start');
    logger.info('   • Mapa: GET /api/rpg/world-map');
    logger.info('   • Achievements: GET /api/rpg/achievements');

    // Disconnect
    await mongoose.disconnect();
    logger.info('\n✅ Desconectado do MongoDB');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Erro ao setup do RPG System:', error);
    process.exit(1);
  }
}

// Run setup
setupRPGSystem();
