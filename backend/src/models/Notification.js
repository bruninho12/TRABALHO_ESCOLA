/**
 * 🔔 Notification Model
 * Modelo para sistema de notificações
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "budget_exceeded",
        "goal_achieved",
        "bill_reminder",
        "push",
        "insight",
        "achievement",
        "weekly_summary",
        "recurring_transaction",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    readAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Índices para performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Middleware para auto-expiração de notificações antigas
notificationSchema.pre("save", function (next) {
  // Notificações expiram após 30 dias se não especificado
  if (!this.expiresAt && this.isNew) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Métodos estáticos
notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.deleteOldNotifications = function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
    isRead: true,
  });
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
