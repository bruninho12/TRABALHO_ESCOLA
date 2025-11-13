/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Listar transações do usuário
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filtrar por tipo de transação
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por ID da categoria
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período (YYYY-MM-DD)
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Valor mínimo
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Valor máximo
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, -date, amount, -amount]
 *         description: Ordenação (prefixo - para ordem decrescente)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   post:
 *     summary: Criar uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - description
 *               - amount
 *               - type
 *               - date
 *             properties:
 *               category:
 *                 type: string
 *                 description: ID da categoria
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               date:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: string
 *               notes:
 *                 type: string
 *               isRecurring:
 *                 type: boolean
 *               recurrenceInterval:
 *                 type: string
 *                 enum: [weekly, monthly, yearly]
 *               recurrenceEndDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/transactions/{id}:
 *   get:
 *     summary: Obter uma transação específica
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Atualizar uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: string
 *               notes:
 *                 type: string
 *               isRecurring:
 *                 type: boolean
 *               recurrenceInterval:
 *                 type: string
 *                 enum: [weekly, monthly, yearly]
 *               recurrenceEndDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Excluir uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transação excluída com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/transactions/summary:
 *   get:
 *     summary: Obter resumo de transações por período
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período (YYYY-MM-DD)
 *         required: true
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período (YYYY-MM-DD)
 *         required: true
 *     responses:
 *       200:
 *         description: Resumo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalIncome:
 *                   type: number
 *                   example: 4700
 *                 totalExpense:
 *                   type: number
 *                   example: 2425.8
 *                 balance:
 *                   type: number
 *                   example: 2274.2
 *                 categorySummary:
 *                   type: object
 *                   properties:
 *                     income:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoryId:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                           color:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           percentage:
 *                             type: number
 *                     expense:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoryId:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                           color:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           percentage:
 *                             type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
