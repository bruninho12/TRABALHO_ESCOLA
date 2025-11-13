/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário (único)
 *         password:
 *           type: string
 *           description: Senha do usuário (armazenada com hash)
 *         avatar:
 *           type: string
 *           description: URL da foto de perfil do usuário
 *         isActive:
 *           type: boolean
 *           description: Indica se o usuário está ativo
 *         isVerified:
 *           type: boolean
 *           description: Indica se o email do usuário foi verificado
 *         settings:
 *           type: object
 *           properties:
 *             theme:
 *               type: string
 *               enum: [light, dark, system]
 *             notificationsEnabled:
 *               type: boolean
 *             showCents:
 *               type: boolean
 *             currency:
 *               type: string
 *             language:
 *               type: string
 *             dateFormat:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         name: "Usuário Demo"
 *         email: "demo@despfinancee.com"
 *         avatar: null
 *         isActive: true
 *         isVerified: true
 *         settings:
 *           theme: "light"
 *           notificationsEnabled: true
 *           showCents: true
 *           currency: "BRL"
 *           language: "pt-BR"
 *           dateFormat: "DD/MM/YYYY"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     Category:
 *       type: object
 *       required:
 *         - user
 *         - name
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         user:
 *           type: string
 *           description: ID do usuário a quem pertence a categoria
 *         name:
 *           type: string
 *           description: Nome da categoria
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo da categoria (receita ou despesa)
 *         color:
 *           type: string
 *           description: Código de cor hexadecimal para a categoria
 *         icon:
 *           type: string
 *           description: Nome do ícone da categoria
 *         isDefault:
 *           type: boolean
 *           description: Indica se é uma categoria padrão
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c86"
 *         user: "60d21b4667d0d8992e610c85"
 *         name: "Alimentação"
 *         type: "expense"
 *         color: "#EF4444"
 *         icon: "restaurant"
 *         isDefault: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     Transaction:
 *       type: object
 *       required:
 *         - user
 *         - category
 *         - description
 *         - amount
 *         - type
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         user:
 *           type: string
 *           description: ID do usuário a quem pertence a transação
 *         category:
 *           type: string
 *           description: ID da categoria da transação
 *         description:
 *           type: string
 *           description: Descrição da transação
 *         amount:
 *           type: number
 *           description: Valor da transação
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo da transação (receita ou despesa)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data da transação
 *         paymentMethod:
 *           type: string
 *           description: Método de pagamento utilizado
 *         notes:
 *           type: string
 *           description: Notas adicionais sobre a transação
 *         isRecurring:
 *           type: boolean
 *           description: Indica se a transação é recorrente
 *         recurrenceInterval:
 *           type: string
 *           enum: [weekly, monthly, yearly]
 *           description: Intervalo de recorrência, se aplicável
 *         recurrenceEndDate:
 *           type: string
 *           format: date-time
 *           description: Data final da recorrência, se aplicável
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c87"
 *         user: "60d21b4667d0d8992e610c85"
 *         category: "60d21b4667d0d8992e610c86"
 *         description: "Supermercado mensal"
 *         amount: 650
 *         type: "expense"
 *         date: "2023-05-10T00:00:00.000Z"
 *         paymentMethod: "Cartão de crédito"
 *         notes: "Compras do mês"
 *         isRecurring: false
 *         createdAt: "2023-05-10T00:00:00.000Z"
 *         updatedAt: "2023-05-10T00:00:00.000Z"
 *
 *     Budget:
 *       type: object
 *       required:
 *         - user
 *         - name
 *         - amount
 *         - startDate
 *       properties:
 *         _id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         user:
 *           type: string
 *           description: ID do usuário a quem pertence o orçamento
 *         name:
 *           type: string
 *           description: Nome do orçamento
 *         amount:
 *           type: number
 *           description: Valor do orçamento
 *         period:
 *           type: string
 *           enum: [monthly, yearly, custom]
 *           description: Período do orçamento
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Data de início do orçamento
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Data de fim do orçamento
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs das categorias associadas ao orçamento
 *         progress:
 *           type: number
 *           description: Progresso do orçamento (0-100)
 *         spent:
 *           type: number
 *           description: Valor já gasto do orçamento
 *         remaining:
 *           type: number
 *           description: Valor restante do orçamento
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c88"
 *         user: "60d21b4667d0d8992e610c85"
 *         name: "Orçamento mensal"
 *         amount: 3000
 *         period: "monthly"
 *         startDate: "2023-05-01T00:00:00.000Z"
 *         endDate: "2023-05-31T23:59:59.999Z"
 *         categories: ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c89"]
 *         progress: 45
 *         spent: 1350
 *         remaining: 1650
 *         createdAt: "2023-05-01T00:00:00.000Z"
 *         updatedAt: "2023-05-01T00:00:00.000Z"
 *
 *     Notification:
 *       type: object
 *       required:
 *         - user
 *         - title
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB
 *         user:
 *           type: string
 *           description: ID do usuário a quem pertence a notificação
 *         title:
 *           type: string
 *           description: Título da notificação
 *         message:
 *           type: string
 *           description: Mensagem da notificação
 *         type:
 *           type: string
 *           enum: [info, warning, alert]
 *           description: Tipo da notificação
 *         isRead:
 *           type: boolean
 *           description: Indica se a notificação foi lida
 *         link:
 *           type: string
 *           description: Link opcional para direcionar o usuário
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d21b4667d0d8992e610c90"
 *         user: "60d21b4667d0d8992e610c85"
 *         title: "Orçamento de Alimentação"
 *         message: "Você já gastou 80% do seu orçamento de alimentação neste mês."
 *         type: "warning"
 *         isRead: false
 *         link: null
 *         createdAt: "2023-05-20T00:00:00.000Z"
 *         updatedAt: "2023-05-20T00:00:00.000Z"
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Não autorizado. Token de autenticação ausente ou inválido.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Não autorizado. Faça login para acessar este recurso."
 *     NotFoundError:
 *       description: Recurso não encontrado.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Recurso não encontrado."
 *     ValidationError:
 *       description: Erro de validação.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Erro de validação."
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     message:
 *                       type: string
 */
