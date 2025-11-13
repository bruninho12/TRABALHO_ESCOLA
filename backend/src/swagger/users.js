/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Perfil atualizado com sucesso"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/users/change-password:
 *   put:
 *     summary: Alterar senha do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
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
 *                   example: "Senha alterada com sucesso"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Senha atual incorreta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Senha atual incorreta"
 *
 * /api/users/settings:
 *   get:
 *     summary: Obter configurações do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações do usuário retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 settings:
 *                   type: object
 *                   properties:
 *                     theme:
 *                       type: string
 *                       example: "light"
 *                     notificationsEnabled:
 *                       type: boolean
 *                       example: true
 *                     showCents:
 *                       type: boolean
 *                       example: true
 *                     currency:
 *                       type: string
 *                       example: "BRL"
 *                     language:
 *                       type: string
 *                       example: "pt-BR"
 *                     dateFormat:
 *                       type: string
 *                       example: "DD/MM/YYYY"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   put:
 *     summary: Atualizar configurações do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark, system]
 *               notificationsEnabled:
 *                 type: boolean
 *               showCents:
 *                 type: boolean
 *               currency:
 *                 type: string
 *               language:
 *                 type: string
 *               dateFormat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 settings:
 *                   type: object
 *                   properties:
 *                     theme:
 *                       type: string
 *                       example: "dark"
 *                     notificationsEnabled:
 *                       type: boolean
 *                       example: true
 *                     showCents:
 *                       type: boolean
 *                       example: true
 *                     currency:
 *                       type: string
 *                       example: "BRL"
 *                     language:
 *                       type: string
 *                       example: "pt-BR"
 *                     dateFormat:
 *                       type: string
 *                       example: "DD/MM/YYYY"
 *                 message:
 *                   type: string
 *                   example: "Configurações atualizadas com sucesso"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
