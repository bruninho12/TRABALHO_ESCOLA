// Email Service for DespFinance
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = this.createTransporter();
        this.templates = new Map();
        this.loadEmailTemplates();
    }

    createTransporter() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async loadEmailTemplates() {
        const templatesDir = path.join(__dirname, '../templates/emails');
        try {
            const files = await fs.readdir(templatesDir);
            for (const file of files) {
                if (file.endsWith('.html')) {
                    const templateName = file.replace('.html', '');
                    const templateContent = await fs.readFile(path.join(templatesDir, file), 'utf8');
                    this.templates.set(templateName, templateContent);
                }
            }
        } catch (error) {
            console.log('Templates de email não encontrados, usando templates padrão');
            this.loadDefaultTemplates();
        }
    }

    loadDefaultTemplates() {
        // Template de boas-vindas
        this.templates.set('welcome', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Bem-vindo ao DespFinance!</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; padding: 40px 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Bem-vindo ao DespFinance!</h1>
                        <p>Sua jornada para a liberdade financeira começa agora!</p>
                    </div>
                    <div class="content">
                        <h2>Olá, {{name}}!</h2>
                        <p>Estamos muito felizes em tê-lo conosco! O DespFinance é mais que um app de controle financeiro - é um sistema gamificado que recompensa sua disciplina financeira.</p>
                        
                        <h3>🎮 Como funciona:</h3>
                        <ul>
                            <li><strong>Crie metas financeiras</strong> e acompanhe seu progresso</li>
                            <li><strong>Complete objetivos</strong> para subir de nível</li>
                            <li><strong>Ganhe recompensas reais</strong> como meses grátis de streaming</li>
                            <li><strong>Visualize suas finanças</strong> com gráficos inteligentes</li>
                        </ul>

                        <p>Para começar, confirme seu email clicando no botão abaixo:</p>
                        <a href="{{confirmationUrl}}" class="button">Confirmar Email</a>
                        
                        <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
                        <p><small>{{confirmationUrl}}</small></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 DespFinance. Transformando finanças em diversão!</p>
                        <p>Precisa de ajuda? <a href="mailto:suporte@despfinance.com">suporte@despfinance.com</a></p>
                    </div>
                </div>
            </body>
            </html>
        `);

        // Template de recuperação de senha
        this.templates.set('reset-password', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Recuperação de Senha - DespFinance</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 40px 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    .warning { background: #fef3cd; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Recuperação de Senha</h1>
                        <p>Solicitação de nova senha</p>
                    </div>
                    <div class="content">
                        <h2>Olá, {{name}}!</h2>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta no DespFinance.</p>
                        
                        <p>Para criar uma nova senha, clique no botão abaixo:</p>
                        <a href="{{resetUrl}}" class="button">Redefinir Senha</a>
                        
                        <div class="warning">
                            <strong>⚠️ Atenção:</strong> Este link expira em 1 hora por motivos de segurança.
                        </div>
                        
                        <p>Se você não solicitou esta alteração, pode ignorar este email com segurança.</p>
                        
                        <p><small>Link alternativo: {{resetUrl}}</small></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 DespFinance. Sua segurança é nossa prioridade!</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        // Template de pagamento confirmado
        this.templates.set('payment-confirmed', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Pagamento Confirmado - DespFinance Premium</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 40px 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    .success { background: #d1fae5; border: 1px solid #10b981; border-radius: 6px; padding: 15px; margin: 20px 0; color: #065f46; }
                    .receipt { background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Pagamento Confirmado!</h1>
                        <p>Bem-vindo ao DespFinance Premium!</p>
                    </div>
                    <div class="content">
                        <h2>Olá, {{name}}!</h2>
                        
                        <div class="success">
                            <strong>🎉 Parabéns!</strong> Seu pagamento foi processado com sucesso e agora você é um membro Premium!
                        </div>
                        
                        <div class="receipt">
                            <h3>Detalhes do Pagamento</h3>
                            <p><strong>Plano:</strong> {{planName}}</p>
                            <p><strong>Valor:</strong> {{amount}}</p>
                            <p><strong>Método:</strong> {{paymentMethod}}</p>
                            <p><strong>Data:</strong> {{paymentDate}}</p>
                            <p><strong>ID da Transação:</strong> {{transactionId}}</p>
                        </div>

                        <h3>🚀 O que você ganhou:</h3>
                        <ul>
                            <li>Acesso completo a todos os recursos Premium</li>
                            <li>Relatórios avançados e insights personalizados</li>
                            <li>Recompensas de streaming exclusivas</li>
                            <li>Suporte prioritário</li>
                            <li>Backup automático na nuvem</li>
                        </ul>
                        
                        <a href="{{dashboardUrl}}" class="button">Acessar Dashboard Premium</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 DespFinance. Obrigado por fazer parte da família Premium!</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        // Template de recompensa resgatada
        this.templates.set('reward-claimed', `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Recompensa Resgatada! - DespFinance</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 40px 30px; text-align: center; }
                    .content { padding: 30px; }
                    .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
                    .reward-card { background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
                    .code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 4px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎁 Recompensa Resgatada!</h1>
                        <p>Você conquistou sua recompensa de streaming!</p>
                    </div>
                    <div class="content">
                        <h2>Parabéns, {{name}}! 🎉</h2>
                        
                        <p>Você atingiu suas metas financeiras e conquistou sua recompensa! Aqui estão os detalhes:</p>
                        
                        <div class="reward-card">
                            <h3>{{platform}}</h3>
                            <p>{{months}} mês(es) grátis</p>
                            <div class="code">{{rewardCode}}</div>
                            <p><small>Código válido até: {{expirationDate}}</small></p>
                        </div>

                        <h3>📋 Como resgatar:</h3>
                        <p>{{instructions}}</p>
                        
                        <p><strong>Importante:</strong> Guarde bem este código! Ele é único e expira em 6 meses.</p>
                        
                        <a href="{{dashboardUrl}}" class="button">Ver Minhas Recompensas</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 DespFinance. Continue conquistando suas metas!</p>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    async sendEmail(to, subject, templateName, data = {}) {
        try {
            const template = this.templates.get(templateName);
            if (!template) {
                throw new Error(`Template '${templateName}' não encontrado`);
            }

            // Replace template variables
            let htmlContent = template;
            for (const [key, value] of Object.entries(data)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                htmlContent = htmlContent.replace(regex, value);
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                html: htmlContent
            };

            const result = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email enviado com sucesso'
            };

        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Specific email methods
    async sendWelcomeEmail(user, confirmationUrl) {
        return await this.sendEmail(
            user.email,
            'Bem-vindo ao DespFinance! 🎉',
            'welcome',
            {
                name: user.name,
                confirmationUrl
            }
        );
    }

    async sendPasswordResetEmail(user, resetUrl) {
        return await this.sendEmail(
            user.email,
            'Recuperação de Senha - DespFinance',
            'reset-password',
            {
                name: user.name,
                resetUrl
            }
        );
    }

    async sendPaymentConfirmationEmail(user, paymentDetails) {
        return await this.sendEmail(
            user.email,
            'Pagamento Confirmado - DespFinance Premium ✅',
            'payment-confirmed',
            {
                name: user.name,
                planName: paymentDetails.planName,
                amount: paymentDetails.amount,
                paymentMethod: paymentDetails.paymentMethod,
                paymentDate: paymentDetails.paymentDate,
                transactionId: paymentDetails.transactionId,
                dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`
            }
        );
    }

    async sendRewardClaimedEmail(user, reward) {
        return await this.sendEmail(
            user.email,
            `Recompensa ${reward.platform} Resgatada! 🎁`,
            'reward-claimed',
            {
                name: user.name,
                platform: reward.platform,
                months: reward.months,
                rewardCode: reward.code,
                expirationDate: new Date(reward.expiresAt).toLocaleDateString('pt-BR'),
                instructions: reward.instructions,
                dashboardUrl: `${process.env.FRONTEND_URL}/recompensas`
            }
        );
    }

    async sendGoalCompletedEmail(user, goal) {
        return await this.sendEmail(
            user.email,
            `Meta "${goal.title}" Concluída! 🎯`,
            'goal-completed',
            {
                name: user.name,
                goalTitle: goal.title,
                goalAmount: goal.targetAmount,
                completionDate: new Date().toLocaleDateString('pt-BR'),
                dashboardUrl: `${process.env.FRONTEND_URL}/metas`
            }
        );
    }

    async sendLevelUpEmail(user, newLevel, oldLevel) {
        return await this.sendEmail(
            user.email,
            `Level Up! Você é agora ${newLevel}! 🏆`,
            'level-up',
            {
                name: user.name,
                newLevel,
                oldLevel,
                rewardsUrl: `${process.env.FRONTEND_URL}/recompensas`
            }
        );
    }

    // Test email connectivity
    async testConnection() {
        try {
            await this.transporter.verify();
            return { success: true, message: 'Conexão de email OK' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = EmailService;