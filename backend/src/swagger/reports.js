/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Obter um resumo financeiro para relatório
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, quarter, year, custom]
 *           default: month
 *         description: Período para o relatório
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para período personalizado (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para período personalizado (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Relatório resumido retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date
 *                         end:
 *                           type: string
 *                           format: date
 *                         label:
 *                           type: string
 *                           example: "Maio 2023"
 *                     income:
 *                       type: number
 *                       example: 4700
 *                     expense:
 *                       type: number
 *                       example: 2425.8
 *                     balance:
 *                       type: number
 *                       example: 2274.2
 *                     savingsRate:
 *                       type: number
 *                       example: 48.39
 *                 categories:
 *                   type: object
 *                   properties:
 *                     income:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             $ref: '#/components/schemas/Category'
 *                           amount:
 *                             type: number
 *                           percentage:
 *                             type: number
 *                           count:
 *                             type: number
 *                     expense:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             $ref: '#/components/schemas/Category'
 *                           amount:
 *                             type: number
 *                           percentage:
 *                             type: number
 *                           count:
 *                             type: number
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2023-05-01"
 *                       income:
 *                         type: number
 *                       expense:
 *                         type: number
 *                       balance:
 *                         type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/reports/export:
 *   get:
 *     summary: Exportar relatório em diferentes formatos
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, quarter, year, custom]
 *           default: month
 *         description: Período para o relatório
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para período personalizado (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para período personalizado (YYYY-MM-DD)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, csv, excel]
 *           default: pdf
 *         description: Formato do arquivo a ser exportado
 *     responses:
 *       200:
 *         description: Arquivo do relatório exportado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/reports/transactions:
 *   get:
 *     summary: Obter lista completa de transações para relatório
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *         required: true
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
 *         required: true
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, all]
 *           default: all
 *         description: Tipo de transação
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID da categoria
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, -date, amount, -amount]
 *           default: date
 *         description: Campo para ordenação
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
 *                 summary:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                       example: 25
 *                     totalIncome:
 *                       type: number
 *                       example: 4700
 *                     totalExpense:
 *                       type: number
 *                       example: 2425.8
 *                     balance:
 *                       type: number
 *                       example: 2274.2
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/reports/category-analysis:
 *   get:
 *     summary: Obter análise detalhada por categoria
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID da categoria para análise
 *         required: true
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, quarter, year, custom]
 *           default: month
 *         description: Período para a análise
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para período personalizado (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para período personalizado (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Análise por categoria retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     average:
 *                       type: number
 *                     highest:
 *                       type: number
 *                     lowest:
 *                       type: number
 *                     count:
 *                       type: number
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2023-05-01"
 *                       amount:
 *                         type: number
 *                       count:
 *                         type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
