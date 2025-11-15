const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["subscription", "purchase", "refund", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BRL",
    },
    description: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "stripe",
        "mercadopago",
        "credit_card",
        "debit_card",
        "pix",
        "wallet",
      ],
      required: true,
    },
    externalId: {
      type: String, // ID da transação no gateway de pagamento
      unique: true,
      sparse: true,
    },
    stripeData: {
      sessionId: String,
      paymentIntentId: String,
      chargeId: String,
    },
    mercadopagoData: {
      preferenceId: String,
      paymentId: String,
      collectorId: String,
    },
    item: {
      type: {
        type: String,
        enum: ["premium_subscription", "coins_pack", "feature_unlock"],
      },
      name: String,
      quantity: Number,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      referer: String,
    },
    invoice: {
      number: String,
      url: String,
      issuedAt: Date,
    },
    receipt: {
      number: String,
      url: String,
      issuedAt: Date,
    },
    attemptCount: {
      type: Number,
      default: 1,
    },
    lastAttemptAt: Date,
    failureReason: String,
    notes: String,
  },
  {
    collection: "pagamentos",
    timestamps: true,
  }
);

// Índices para performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ userId: 1, status: 1 });

paymentSchema.index({ status: 1, updatedAt: -1 });

// Método para marcar como bem-sucedido
paymentSchema.methods.markSuccess = function markSuccess(
  externalId,
  data = {}
) {
  this.status = "completed";
  this.externalId = externalId;
  if (data.stripe) {
    this.stripeData = { ...this.stripeData, ...data.stripe };
  }
  if (data.mercadopago) {
    this.mercadopagoData = { ...this.mercadopagoData, ...data.mercadopago };
  }
  return this;
};

// Método para marcar como falho
paymentSchema.methods.markFailed = function markFailed(reason) {
  this.status = "failed";
  this.failureReason = reason;
  this.lastAttemptAt = new Date();
  this.attemptCount += 1;
  return this;
};

// Middleware para gerar número de fatura
paymentSchema.pre("save", function preSave() {
  if (!this.invoice?.number && this.status === "completed") {
    const now = new Date();
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 10000);
    this.invoice = {
      number: `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(now.getDate()).padStart(2, "0")}-${timestamp}-${random}`,
      issuedAt: now,
    };
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
