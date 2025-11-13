const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    color: {
      type: String,
      default: "#000000",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "cupons",
    timestamps: true,
  }
);

// Índices para melhorar a performance das consultas
categorySchema.index({ user: 1, type: 1 });
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
