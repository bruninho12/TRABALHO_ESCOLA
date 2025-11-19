/**
 * Script para completar inimigos das cidades 7-10
 * Adicionando inimigos únicos e balanceados para cada cidade
 */

const mongoose = require("mongoose");
require("../../src/config/database");

const ENEMY_TEMPLATES = {
  7: [
    {
      type: "Dívida",
      name: "Dívida Infernal",
      healthMin: 140,
      healthMax: 200,
      spawnRate: 0.25,
    },
    {
      type: "Juro",
      name: "Juro Incandescente",
      healthMin: 130,
      healthMax: 190,
      spawnRate: 0.3,
    },
    {
      type: "Imposto",
      name: "Tributo de Fogo",
      healthMin: 125,
      healthMax: 185,
      spawnRate: 0.25,
    },
    {
      type: "Emergência",
      name: "Erupção de Gastos",
      healthMin: 120,
      healthMax: 180,
      spawnRate: 0.2,
    },
  ],
  8: [
    {
      type: "Conformismo",
      name: "Espírito da Mediocridade",
      healthMin: 160,
      healthMax: 220,
      spawnRate: 0.3,
    },
    {
      type: "Limitação",
      name: "Barreira Mental",
      healthMin: 150,
      healthMax: 210,
      spawnRate: 0.3,
    },
    {
      type: "Medo",
      name: "Terror do Sucesso",
      healthMin: 145,
      healthMax: 205,
      spawnRate: 0.25,
    },
    {
      type: "Preguiça",
      name: "Demônio da Procrastinação",
      healthMin: 140,
      healthMax: 200,
      spawnRate: 0.15,
    },
  ],
  9: [
    {
      type: "Ganância",
      name: "Hydra da Cobiça",
      healthMin: 180,
      healthMax: 250,
      spawnRate: 0.25,
    },
    {
      type: "Luxúria",
      name: "Sombra do Exesso",
      healthMin: 170,
      healthMax: 240,
      spawnRate: 0.3,
    },
    {
      type: "Inveja",
      name: "Olho Verde do Desejo",
      healthMin: 175,
      healthMax: 245,
      spawnRate: 0.25,
    },
    {
      type: "Ira",
      name: "Fúria Gastadora",
      healthMin: 165,
      healthMax: 235,
      spawnRate: 0.2,
    },
  ],
  10: [
    {
      type: "Apocalipse",
      name: "Arauto da Falência",
      healthMin: 200,
      healthMax: 300,
      spawnRate: 0.2,
    },
    {
      type: "Destino",
      name: "Servo do Caos Financeiro",
      healthMin: 220,
      healthMax: 320,
      spawnRate: 0.25,
    },
    {
      type: "Eternidade",
      name: "Guardião da Miséria",
      healthMin: 190,
      healthMax: 280,
      spawnRate: 0.3,
    },
    {
      type: "Void",
      name: "Devorador de Sonhos",
      healthMin: 210,
      healthMax: 310,
      spawnRate: 0.25,
    },
  ],
};

async function addEnemiesToCities() {
  try {
    console.log("🚀 Iniciando adição de inimigos às cidades...");

    const WorldMap = require("../../src/models/WorldMap");

    for (const cityNumber of [7, 8, 9, 10]) {
      console.log(`⚔️ Processando cidade ${cityNumber}...`);

      const city = await WorldMap.findOne({ cityNumber: cityNumber });

      if (city) {
        city.enemies = ENEMY_TEMPLATES[cityNumber];
        await city.save();
        console.log(
          `✅ Cidade ${cityNumber} atualizada com ${city.enemies.length} inimigos!`
        );
      } else {
        console.log(`⚠️ Cidade ${cityNumber} não encontrada no banco`);
      }
    }

    console.log("🎉 Todos os inimigos foram adicionados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao adicionar inimigos:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Executar script
addEnemiesToCities();
