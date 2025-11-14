// Mercado Pago Payment Service
const axios = require("axios");

class MercadoPagoService {
  constructor() {
    this.accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    this.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://api.mercadopago.com"
        : "https://api.mercadopago.com"; // Same for sandbox

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": this.generateIdempotencyKey(),
      },
    });
  }

  generateIdempotencyKey() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Criar preferência de pagamento
  async createPaymentPreference(paymentData) {
    try {
      const preference = {
        items: [
          {
            title: paymentData.title || "DespFinance Premium",
            description:
              paymentData.description || "Assinatura Premium DespFinance",
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: "BRL",
          },
        ],
        payer: {
          name: paymentData.customer.name,
          email: paymentData.customer.email,
          identification: {
            type: "CPF",
            number: paymentData.customer.cpf,
          },
          address: {
            street_name: paymentData.customer.address?.street,
            street_number: paymentData.customer.address?.number,
            zip_code: paymentData.customer.address?.zipcode,
          },
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`,
        external_reference: paymentData.orderId,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(), // 24 hours
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12,
        },
      };

      const response = await this.client.post(
        "/checkout/preferences",
        preference
      );

      return {
        success: true,
        preferenceId: response.data.id,
        initPoint: response.data.init_point,
        sandboxInitPoint: response.data.sandbox_init_point,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao criar preferência MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao processar pagamento com Mercado Pago");
    }
  }

  // Criar pagamento direto (PIX, Cartão, etc.)
  async createDirectPayment(paymentData) {
    try {
      const payment = {
        transaction_amount: paymentData.amount,
        description: paymentData.description || "DespFinance Premium",
        payment_method_id: paymentData.paymentMethodId,
        payer: {
          email: paymentData.customer.email,
          first_name: paymentData.customer.firstName,
          last_name: paymentData.customer.lastName,
          identification: {
            type: "CPF",
            number: paymentData.customer.cpf,
          },
        },
        external_reference: paymentData.orderId,
        notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`,
      };

      // Configurações específicas por método de pagamento
      if (paymentData.paymentMethodId === "pix") {
        payment.date_of_expiration = new Date(
          Date.now() + 30 * 60 * 1000
        ).toISOString(); // 30 min
      } else if (paymentData.card) {
        payment.token = paymentData.card.token;
        payment.installments = paymentData.installments || 1;
        payment.issuer_id = paymentData.card.issuerId;
      }

      const response = await this.client.post("/v1/payments", payment);

      return {
        success: true,
        paymentId: response.data.id,
        status: response.data.status,
        paymentMethod: response.data.payment_method_id,
        qrCode: response.data.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64:
          response.data.point_of_interaction?.transaction_data?.qr_code_base64,
        pixCopyPaste:
          response.data.point_of_interaction?.transaction_data?.qr_code,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao criar pagamento MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao processar pagamento direto");
    }
  }

  // Criar assinatura recorrente
  async createSubscription(subscriptionData) {
    try {
      // Primeiro, criar um plano de assinatura
      // eslint-disable-next-line no-unused-vars
      const plan = await this.createSubscriptionPlan(subscriptionData.plan);

      // Depois, criar a assinatura
      const subscription = {
        reason: subscriptionData.reason || "DespFinance Premium",
        auto_recurring: {
          frequency: subscriptionData.frequency || 1,
          frequency_type: subscriptionData.frequencyType || "months",
          transaction_amount: subscriptionData.amount,
          currency_id: "BRL",
        },
        payer_email: subscriptionData.customer.email,
        back_url: `${process.env.FRONTEND_URL}/subscription/success`,
        external_reference: subscriptionData.orderId,
      };

      const response = await this.client.post("/preapproval", subscription);

      return {
        success: true,
        subscriptionId: response.data.id,
        initPoint: response.data.init_point,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao criar assinatura MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao criar assinatura");
    }
  }

  // Criar plano de assinatura
  async createSubscriptionPlan(planData) {
    try {
      const plan = {
        reason: planData.name || "DespFinance Premium Plan",
        auto_recurring: {
          frequency: planData.frequency || 1,
          frequency_type: planData.frequencyType || "months",
          transaction_amount: planData.amount,
          currency_id: "BRL",
        },
      };

      const response = await this.client.post("/preapproval_plan", plan);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar plano MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao criar plano de assinatura");
    }
  }

  // Buscar informações de pagamento
  async getPayment(paymentId) {
    try {
      const response = await this.client.get(`/v1/payments/${paymentId}`);
      return {
        success: true,
        payment: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao buscar pagamento MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Pagamento não encontrado");
    }
  }

  // Cancelar pagamento
  async cancelPayment(paymentId) {
    try {
      const response = await this.client.put(`/v1/payments/${paymentId}`, {
        status: "cancelled",
      });

      return {
        success: true,
        payment: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao cancelar pagamento MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao cancelar pagamento");
    }
  }

  // Buscar métodos de pagamento disponíveis
  async getPaymentMethods() {
    try {
      const response = await this.client.get("/v1/payment_methods");
      return {
        success: true,
        paymentMethods: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao buscar métodos de pagamento:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao buscar métodos de pagamento");
    }
  }

  // Processar webhook do Mercado Pago
  async processWebhook(webhookData) {
    try {
      const { type, data } = webhookData;

      if (type === "payment") {
        const payment = await this.getPayment(data.id);

        return {
          type: "payment",
          paymentId: data.id,
          status: payment.payment.status,
          externalReference: payment.payment.external_reference,
          amount: payment.payment.transaction_amount,
          paymentMethod: payment.payment.payment_method_id,
          data: payment.payment,
        };
      }

      if (type === "preapproval") {
        // Processar webhook de assinatura
        const response = await this.client.get(`/preapproval/${data.id}`);

        return {
          type: "subscription",
          subscriptionId: data.id,
          status: response.data.status,
          data: response.data,
        };
      }

      return {
        type: "unknown",
        data: webhookData,
      };
    } catch (error) {
      console.error("Erro ao processar webhook MercadoPago:", error.message);
      throw new Error("Erro ao processar webhook");
    }
  }

  // Reembolsar pagamento
  async refundPayment(paymentId, amount = null) {
    try {
      const refundData = amount ? { amount } : {};

      const response = await this.client.post(
        `/v1/payments/${paymentId}/refunds`,
        refundData
      );

      return {
        success: true,
        refund: response.data,
      };
    } catch (error) {
      console.error(
        "Erro ao reembolsar pagamento MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao processar reembolso");
    }
  }

  // Gerar relatório de vendas
  async getSalesReport(startDate, endDate) {
    try {
      const response = await this.client.get("/v1/payments/search", {
        params: {
          begin_date: startDate,
          end_date: endDate,
          limit: 50,
          sort: "date_created",
          criteria: "desc",
        },
      });

      return {
        success: true,
        payments: response.data.results,
        total: response.data.paging.total,
      };
    } catch (error) {
      console.error(
        "Erro ao gerar relatório MercadoPago:",
        error.response?.data || error.message
      );
      throw new Error("Erro ao gerar relatório de vendas");
    }
  }
}

module.exports = MercadoPagoService;
