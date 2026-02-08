// utils/mercadoPagoService.js
const axios = require("axios");
const logger = require("./logger");

class MercadoPagoService {
  constructor() {
    this.accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    this.baseURL = "https://api.mercadopago.com";
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Criar preferência de pagamento (Checkout Pro)
  async createPaymentPreference(preferenceData) {
    try {
      // Adaptar payload para o padrão MercadoPago
      const payload = {
        items: [
          {
            title: preferenceData.title,
            quantity: 1,
            unit_price: parseFloat(preferenceData.amount),
          },
        ],
        payer: {
          name: preferenceData.customer.name,
          email: preferenceData.customer.email,
          identification: {
            type: "CPF",
            number: preferenceData.customer.cpf || "12345678909",
          },
          address: {
            street_name: preferenceData.customer.address.street,
            street_number: preferenceData.customer.address.number,
            zip_code: preferenceData.customer.address.zipcode,
          },
        },
        external_reference: preferenceData.orderId,
        back_urls: {
          success:
            preferenceData.back_urls?.success || "https://example.com/success",
          failure:
            preferenceData.back_urls?.failure || "https://example.com/failure",
          pending:
            preferenceData.back_urls?.pending || "https://example.com/pending",
        },
        auto_return: "approved",
      };

      const response = await this.client.post("/checkout/preferences", payload);

      return {
        preferenceId: response.data.id,
        initPoint: response.data.init_point,
        sandboxInitPoint: response.data.sandbox_init_point,
      };
    } catch (error) {
      logger.error("Erro MercadoPago (createPaymentPreference):", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || "Erro ao criar preferência MercadoPago"
      );
    }
  }

  // Criar pagamento direto (PIX, cartão)
  async createDirectPayment(paymentData) {
    try {
      const payload = {
        transaction_amount: parseFloat(paymentData.amount),
        payment_method_id: paymentData.paymentMethodId,
        installments: paymentData.installments || 1,
        payer: {
          email: paymentData.customer.email,
          first_name: paymentData.customer.firstName,
          last_name: paymentData.customer.lastName,
          identification: {
            type: "CPF",
            number: paymentData.customer.cpf || "00000000000",
          },
        },
        description: paymentData.description,
        external_reference: paymentData.orderId,
        card: paymentData.card || undefined,
      };

      // Gerar chave idempotente única para cada pagamento
      const idempotencyKey = `${paymentData.orderId}-${Date.now()}`;
      const response = await this.client.post("/v1/payments", payload, {
        headers: {
          "X-Idempotency-Key": idempotencyKey,
        },
      });

      return {
        paymentId: response.data.id,
        status: response.data.status,
        paymentMethod: response.data.payment_method_id,
        qrCode:
          response.data.point_of_interaction?.transaction_data?.qr_code || null,
        qrCodeBase64:
          response.data.point_of_interaction?.transaction_data
            ?.qr_code_base64 || null,
        pixCopyPaste:
          response.data.point_of_interaction?.transaction_data?.qr_code || null,
      };
    } catch (error) {
      logger.error("Erro MercadoPago (createDirectPayment):", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message ||
          "Erro ao criar pagamento direto MercadoPago"
      );
    }
  }

  // Processar webhook do MercadoPago
  async processWebhook(body) {
    try {
      // Retornar dados padronizados
      const { type, data, action } = body;
      return {
        type: type,
        paymentId: data.id,
        externalReference: data.external_reference,
        status: data.status,
        paymentMethod: data.payment_method_id,
        action,
      };
    } catch (error) {
      logger.error("Erro ao processar webhook MercadoPago:", error);
      throw new Error("Erro ao processar webhook MercadoPago");
    }
  }

  // Obter métodos de pagamento
  async getPaymentMethods() {
    try {
      const response = await this.client.get("/v1/payment_methods");
      return { paymentMethods: response.data };
    } catch (error) {
      logger.error("Erro ao obter métodos de pagamento MercadoPago:", error);
      throw new Error("Erro ao obter métodos de pagamento MercadoPago");
    }
  }
}

module.exports = MercadoPagoService;
