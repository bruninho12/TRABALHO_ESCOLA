const { Notification } = require("../models");
const { AppError } = require("../middleware/errorHandler");

// Listar notificações
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar notificações do usuário
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      data: {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      },
    });
  } catch (error) {
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
