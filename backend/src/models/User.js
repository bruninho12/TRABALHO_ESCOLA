const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Por favor, forneça um email válido",
      ],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username deve ter no mínimo 3 caracteres"],
      maxlength: [50, "Username deve ter no máximo 50 caracteres"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
      select: false, // Por padrão não retorna a senha
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "BRL",
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerification: {
      code: {
        type: String,
        default: null,
        select: false,
      },
      token: {
        type: String,
        default: null,
        select: false,
      },
      expiresAt: {
        type: Date,
        default: null,
        select: false,
      },
      verified: {
        type: Boolean,
        default: false,
        select: false,
      },
      verifiedAt: {
        type: Date,
        default: null,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockReason: {
      type: String,
      default: null,
    },
  },
  {
    collection: "usuários",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.twoFactorSecret;
        return ret;
      },
    },
  }
);

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ level: -1, score: -1 }); // Para leaderboards

// Hash de senha antes de salvar
userSchema.pre("save", async function preHashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(`Erro ao comparar senhas: ${err.message}`);
  }
};

// Método para atualizar XP
userSchema.methods.addExperience = function addExperience(amount) {
  this.experience += amount;
  // Calcular novo level baseado em XP (100 XP por level)
  const newLevel = Math.floor(this.experience / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this;
};

// Remover senha antes de serializar
userSchema.methods.toJSON = function toJSON() {
  // eslint-disable-next-line no-unused-vars
  const {
    password,
    emailVerificationToken,
    passwordResetToken,
    twoFactorSecret,
    ...userWithoutPassword
  } = this.toObject();
  return userWithoutPassword;
};

module.exports = mongoose.model("User", userSchema);
