const { Notification } = require("../models");
const { AppError } = require("../middleware/errorHandler");
const { logger } = require("../utils/logger");

// Listar notificações com filtros e paginação
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { page = 1, limit = 20, isRead, type, priority } = req.query;

    // Construir filtros
    const filter = { userId };
    if (isRead !== undefined) filter.isRead = isRead === "true";
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // Buscar notificações com paginação
    const skip = (page - 1) * limit;
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1, priority: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalItems: total,
          limit: parseInt(limit),
        },
        unreadCount,
      },
    });
  } catch (error) {
    logger.error("Error fetching notifications:", error);
    next(error);
  }
};

// Marcar notificação como lida
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se a notificação existe e pertence ao usuário
    const notification = await Notification.findOne({
      _id: id,
      userId,
    });

    if (!notification) {
      return next(new AppError("Notificação não encontrada", 404));
    }

    // Atualizar notificação
    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      status: "success",
      message: "Notificação marcada como lida",
    });
  } catch (error) {
    next(error);
  }
};

// Marcar todas as notificações como lidas
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Atualizar todas as notificações do usuário
    await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Todas as notificações foram marcadas como lidas",
    });
  } catch (error) {
    next(error);
  }
};
