/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Listar todos os orçamentos do usuário
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, yearly, custom]
 *         description: Filtrar por período
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas orçamentos ativos
 *     responses:
 *       200:
 *         description: Lista de orçamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budgets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   post:
 *     summary: Criar um novo orçamento
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               period:
 *                 type: string
 *                 enum: [monthly, yearly, custom]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de IDs de categorias
 *     responses:
 *       201:
 *         description: Orçamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/budgets/{id}:
 *   get:
 *     summary: Obter um orçamento específico
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     responses:
 *       200:
 *         description: Orçamento retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   $ref: '#/components/schemas/Budget'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Atualizar um orçamento
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Orçamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Excluir um orçamento
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     responses:
 *       200:
 *         description: Orçamento excluído com sucesso
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
 *                   example: "Orçamento excluído com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/budgets/{id}/progress:
 *   get:
 *     summary: Obter progresso de um orçamento
 *     tags: [Orçamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     responses:
 *       200:
 *         description: Progresso do orçamento retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     progress:
 *                       type: number
 *                     spent:
 *                       type: number
 *                     remaining:
 *                       type: number
 *                     categoryBreakdown:
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
 *                           spent:
 *                             type: number
 *                           percentage:
 *                             type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
