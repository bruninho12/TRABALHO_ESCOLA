/**
 * Script de teste para MercadoPago
 * Execute: node scripts/test-mercadopago.js
 */

require("dotenv").config();
const MercadoPagoService = require("../../src/utils/mercadoPagoService");

async function testMercadoPago() {
  console.log("🔄 Testando integração MercadoPago...\n");

  try {
    // Verificar variáveis de ambiente
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env");
    }

    const mercadoPago = new MercadoPagoService();

    console.log("✅ Serviço MercadoPago inicializado");
    console.log(
      "📋 Access Token:",
      process.env.MERCADO_PAGO_ACCESS_TOKEN?.substring(0, 20) + "..."
    );

    // 1. Testar métodos de pagamento disponíveis
    console.log("\n1️⃣ Testando métodos de pagamento...");
    try {
      const methods = await mercadoPago.getPaymentMethods();
      console.log("✅ Métodos disponíveis:", methods.paymentMethods.length);

      // Mostrar alguns métodos principais
      const mainMethods = methods.paymentMethods.filter((method) =>
        ["pix", "visa", "master", "boleto"].includes(method.id)
      );
      mainMethods.forEach((method) => {
        console.log(`   - ${method.name} (${method.id})`);
      });
    } catch (error) {
      console.log("❌ Erro ao obter métodos:", error.message);
    }

    // 2. Testar criação de preferência (Checkout Pro)
    console.log("\n2️⃣ Testando criação de preferência...");
    try {
      const testPayment = {
        title: "DespFinance - Plano SILVER (TESTE)",
        description: "Teste de integração MercadoPago",
        amount: 9.9,
        orderId: "test_" + Date.now(),
        customer: {
          name: "APRO APROVADO",
          email: "test_user_123@testuser.com",
          cpf: "19119119100", // CPF de teste válido
          address: {
            street: "Av Teste",
            number: "123",
            zipcode: "01310100",
          },
        },
      };

      const preference = await mercadoPago.createPaymentPreference(testPayment);
      console.log("✅ Preferência criada com sucesso!");
      console.log("📋 Preference ID:", preference.preferenceId);
      console.log("🌐 Checkout URL:", preference.initPoint);

      if (preference.sandboxInitPoint) {
        console.log("🧪 Sandbox URL:", preference.sandboxInitPoint);
      }
    } catch (error) {
      console.log("❌ Erro ao criar preferência:", error.message);
    }

    // 3. Testar criação de pagamento PIX direto
    console.log("\n3️⃣ Testando criação de pagamento PIX...");
    try {
      const pixPayment = {
        amount: 19.9,
        description: "DespFinance - Plano GOLD (TESTE PIX)",
        paymentMethodId: "pix",
        orderId: "test_pix_" + Date.now(),
        customer: {
          email: "test_user_123@testuser.com",
          firstName: "APRO",
          lastName: "APROVADO",
          cpf: "19119119100", // CPF de teste válido
        },
      };

      const payment = await mercadoPago.createDirectPayment(pixPayment);
      console.log("✅ Pagamento PIX criado com sucesso!");
      console.log("📋 Payment ID:", payment.paymentId);
      console.log("📊 Status:", payment.status);

      if (payment.qrCode) {
        console.log("🔸 QR Code:", payment.qrCode.substring(0, 50) + "...");
      }

      if (payment.pixCopyPaste) {
        console.log(
          "📋 Pix Copia e Cola:",
          payment.pixCopyPaste.substring(0, 50) + "..."
        );
      }
    } catch (error) {
      console.log("❌ Erro ao criar pagamento PIX:", error.message);
    }

    console.log("\n🎉 Teste concluído! Verifique os resultados acima.");
  } catch (error) {
    console.error("💥 Erro geral no teste:", error.message);
    process.exit(1);
  }
}

// Executar teste
if (require.main === module) {
  testMercadoPago()
    .then(() => {
      console.log("\n✅ Todos os testes foram executados.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Erro fatal:", error.message);
      process.exit(1);
    });
}

module.exports = { testMercadoPago };
