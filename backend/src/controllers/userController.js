const { User } = require("../models");
const { AppError } = require("../middleware/errorHandler");

// Perfil do usuário
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar usuário
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar perfil
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, email, currentPassword, newPassword, avatar } = req.body;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    // Verificar se o email já está em uso (se for alterado)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError("Este email já está em uso", 400));
      }
    }

    // Atualizar senha (se solicitado)
    if (newPassword) {
      // Verificar senha atual
      if (!currentPassword) {
        return next(
          new AppError("Senha atual é necessária para alterar a senha", 400)
        );
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return next(new AppError("Senha atual incorreta", 401));
      }

      // Atualizar senha
      user.password = newPassword;
    }

    // Atualizar outros campos
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    // Salvar alterações
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Perfil atualizado com sucesso",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Configurações do usuário
exports.getUserSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar usuário com preferências
    const user = await User.findById(userId).select(
      "preferences email username"
    );

    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        settings: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar configurações
exports.updateUserSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { theme, notifications, emailNotifications, currency } = req.body;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    // Atualizar preferências
    if (theme) user.preferences.theme = theme;
    if (notifications !== undefined)
      user.preferences.notifications = notifications;
    if (emailNotifications !== undefined)
      user.preferences.emailNotifications = emailNotifications;
    if (currency) user.preferences.currency = currency;

    // Salvar alterações
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Configurações atualizadas com sucesso",
      data: {
        settings: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar plano de assinatura do usuário
exports.updateSubscriptionPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    // Validar plano
    const validPlans = ["free", "premium", "anual", "vitalicio"];
    if (!plan || !validPlans.includes(plan)) {
      return next(
        new AppError(`Plano inválido. Opções: ${validPlans.join(", ")}`, 400)
      );
    }

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    // Calcular datas de expiração conforme o plano
    const now = new Date();
    let expiresAt = null;

    switch (plan) {
      case "premium":
        // Premium mensal - 30 dias
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case "anual":
        // Anual - 365 dias
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        break;
      case "vitalicio":
        // Vitalício - sem expiração (100 anos no futuro)
        expiresAt = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "free":
      default:
        // Free - sem expiração
        expiresAt = null;
    }

    // Atualizar plano
    user.subscription = {
      plan,
      startDate: now,
      expiresAt,
      isActive: true,
    };

    // Salvar alterações
    await user.save();

    res.status(200).json({
      status: "success",
      message: `Plano atualizado para ${plan}`,
      data: {
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
