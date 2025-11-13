/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obter dados para o dashboard
 *     description: Retorna um resumo das finanças do usuário para exibição no dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, year, custom]
 *           default: month
 *         description: Período para obter os dados (mês atual, ano atual ou personalizado)
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
 *         description: Dados do dashboard retornados com sucesso
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
 *                     totalIncome:
 *                       type: number
 *                       example: 4700
 *                     totalExpense:
 *                       type: number
 *                       example: 2425.8
 *                     balance:
 *                       type: number
 *                       example: 2274.2
 *                     savingsRate:
 *                       type: number
 *                       example: 48.39
 *                 categoryBreakdown:
 *                   type: object
 *                   properties:
 *                     income:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
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
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           color:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           percentage:
 *                             type: number
 *                 recentTransactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 upcomingBills:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 activeBudgets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       spent:
 *                         type: number
 *                       remaining:
 *                         type: number
 *                       progress:
 *                         type: number
 *                 monthlyTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       income:
 *                         type: number
 *                       expense:
 *                         type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
