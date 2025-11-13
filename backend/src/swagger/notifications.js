/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Listar todas as notificações do usuário
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filtrar por notificações lidas/não lidas
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [info, warning, alert]
 *         description: Filtrar por tipo de notificação
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
 *         description: Lista de notificações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
 *                       example: 15
 *                     pages:
 *                       type: integer
 *                       example: 2
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/notifications/count:
 *   get:
 *     summary: Obter contagem de notificações não lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de notificações não lidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/notifications/{id}:
 *   get:
 *     summary: Obter uma notificação específica
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Marcar notificação como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Excluir uma notificação
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação excluída com sucesso
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
 *                   example: "Notificação excluída com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/notifications/read-all:
 *   put:
 *     summary: Marcar todas as notificações como lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações marcadas como lidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: "3 notificações marcadas como lidas"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
