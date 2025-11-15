const Joi = require("joi");

// Esquemas de validação para autenticação
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    rememberMe: Joi.boolean().optional(),
  }),

  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).max(30).required(),
  }),

  refresh: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

// Esquemas de validação para transações
const transactionSchemas = {
  create: Joi.object({
    description: Joi.string().min(3).max(100).required(),
    amount: Joi.number().required(),
    type: Joi.string().valid("income", "expense").required(),
    date: Joi.date().iso().required(),
    categoryId: Joi.number().integer().required(),
    paymentMethod: Joi.string().max(50).optional(),
    notes: Joi.string().max(500).optional(),
    isRecurring: Joi.boolean().optional(),
    recurrenceInterval: Joi.string()
      .valid("weekly", "monthly", "yearly")
      .optional(),
    recurrenceEndDate: Joi.date().iso().optional(),
  }),

  update: Joi.object({
    description: Joi.string().min(3).max(100).optional(),
    amount: Joi.number().optional(),
    type: Joi.string().valid("income", "expense").optional(),
    date: Joi.date().iso().optional(),
    categoryId: Joi.number().integer().optional(),
    paymentMethod: Joi.string().max(50).optional(),
    notes: Joi.string().max(500).optional().allow(""),
    isRecurring: Joi.boolean().optional(),
    recurrenceInterval: Joi.string()
      .valid("weekly", "monthly", "yearly")
      .optional(),
    recurrenceEndDate: Joi.date().iso().optional().allow(null),
  }),

  import: Joi.object({
    data: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().min(3).max(100).required(),
          amount: Joi.number().required(),
          type: Joi.string().valid("income", "expense").required(),
          date: Joi.date().iso().required(),
          categoryId: Joi.number().integer().required(),
          paymentMethod: Joi.string().max(50).optional(),
          notes: Joi.string().max(500).optional(),
        })
      )
      .required(),
    format: Joi.string().valid("csv", "json").default("csv"),
  }),

  bulkDelete: Joi.object({
    ids: Joi.array().items(Joi.number().integer()).min(1).required(),
  }),
};

// Esquemas de validação para categorias
const categorySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    type: Joi.string().valid("income", "expense").required(),
    color: Joi.string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
    icon: Joi.string().max(50).optional(),
    isDefault: Joi.boolean().default(false),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    color: Joi.string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
    icon: Joi.string().max(50).optional(),
  }),
};

// Esquemas de validação para orçamentos
const budgetSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    amount: Joi.number().positive().required(),
    period: Joi.string().valid("monthly", "yearly", "custom").required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
    categoryId: Joi.number().integer().optional(),
    categories: Joi.array().items(Joi.number().integer()).optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    amount: Joi.number().positive().optional(),
    period: Joi.string().valid("monthly", "yearly", "custom").optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
    categoryId: Joi.number().integer().optional(),
    categories: Joi.array().items(Joi.number().integer()).optional(),
  }),
};

// Esquemas de validação para relatórios
const reportSchemas = {
  export: Joi.object({
    period: Joi.string().valid("month", "quarter", "year", "custom").required(),
    format: Joi.string().valid("pdf", "csv", "excel").default("pdf"),
    start: Joi.date().iso().when("period", {
      is: "custom",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    end: Joi.date().iso().when("period", {
      is: "custom",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
};

// Esquemas de validação para usuários
const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    currentPassword: Joi.string().min(6).when("newPassword", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    newPassword: Joi.string().min(6).max(30).optional(),
    avatar: Joi.string().optional(),
  }),

  updateSettings: Joi.object({
    theme: Joi.string().valid("light", "dark", "system").optional(),
    notificationsEnabled: Joi.boolean().optional(),
    showCents: Joi.boolean().optional(),
    currency: Joi.string().max(3).optional(),
    language: Joi.string().max(5).optional(),
  }),
};

module.exports = {
  authSchemas,
  transactionSchemas,
  categorySchemas,
  budgetSchemas,
  reportSchemas,
  userSchemas,
};
