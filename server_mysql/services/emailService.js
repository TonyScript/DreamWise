const { Resend } = require('resend');

class EmailService {
  constructor() {
    // 从环境变量获取API密钥
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.FROM_EMAIL || 'DreamWise <noreply@charitydoing.com>';
  }

  // 生成6位数验证码
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 发送注册验证码
  async sendRegistrationVerification(email, username, verificationCode) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: '欢迎加入DreamWise - 验证您的邮箱',
        html: this.getRegistrationTemplate(username, verificationCode),
      });

      if (error) {
        console.error('发送注册验证邮件失败:', error);
        throw new Error('邮件发送失败');
      }

      console.log('注册验证邮件发送成功:', data);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('邮件服务错误:', error);
      throw error;
    }
  }

  // 发送密码重置验证码
  async sendPasswordResetVerification(email, username, verificationCode) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'DreamWise - 重置您的密码',
        html: this.getPasswordResetTemplate(username, verificationCode),
      });

      if (error) {
        console.error('发送密码重置邮件失败:', error);
        throw new Error('邮件发送失败');
      }

      console.log('密码重置邮件发送成功:', data);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('邮件服务错误:', error);
      throw error;
    }
  }

  // 发送密码修改验证码
  async sendPasswordChangeVerification(email, username, verificationCode) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'DreamWise - 确认密码修改',
        html: this.getPasswordChangeTemplate(username, verificationCode),
      });

      if (error) {
        console.error('发送密码修改邮件失败:', error);
        throw new Error('邮件发送失败');
      }

      console.log('密码修改邮件发送成功:', data);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('邮件服务错误:', error);
      throw error;
    }
  }

  // 注册验证邮件模板
  getRegistrationTemplate(username, verificationCode) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>验证您的邮箱 - DreamWise</title>
        <style>
          /* 基础样式 - 适配light和dark模式 */
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          
          .header { 
            background: linear-gradient(135deg, #8b5cf6, #ec4899); 
            padding: 40px 30px; 
            text-align: center; 
          }
          
          .header h1 { 
            color: #ffffff !important; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .header p {
            color: rgba(255,255,255,0.95) !important;
            margin: 10px 0 0 0;
            font-size: 16px;
          }
          
          .content { 
            padding: 40px 30px; 
            background: #ffffff;
          }
          
          .content h2 {
            color: #1e293b !important;
            font-size: 24px;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          
          .content p {
            color: #475569 !important;
            font-size: 16px;
            margin: 16px 0;
          }
          
          .verification-code { 
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border: 2px solid #8b5cf6; 
            border-radius: 12px; 
            padding: 30px 20px; 
            text-align: center; 
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
          }
          
          .verification-code p {
            color: #64748b !important;
            font-size: 14px;
            margin: 0;
            font-weight: 500;
          }
          
          .code { 
            font-size: 36px; 
            font-weight: 700; 
            color: #8b5cf6 !important; 
            letter-spacing: 8px; 
            margin: 15px 0;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            text-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
          }
          
          .footer { 
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 30px; 
            text-align: center; 
          }
          
          .footer p {
            color: #64748b !important; 
            font-size: 14px;
            margin: 8px 0;
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body { 
              background-color: #0f172a !important;
              color: #e2e8f0 !important;
            }
            
            .container {
              background: #1e293b !important;
              border-color: #334155 !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
            }
            
            .content {
              background: #1e293b !important;
            }
            
            .content h2 {
              color: #f1f5f9 !important;
            }
            
            .content p {
              color: #cbd5e1 !important;
            }
            
            .verification-code {
              background: linear-gradient(135deg, #334155, #475569) !important;
              border-color: #8b5cf6 !important;
            }
            
            .verification-code p {
              color: #94a3b8 !important;
            }
            
            .footer {
              background: #0f172a !important;
              border-color: #334155 !important;
            }
            
            .footer p {
              color: #94a3b8 !important;
            }
          }
          
          /* 强制样式，确保在所有邮件客户端中正确显示 */
          [data-ogsc] .container { background: #ffffff !important; }
          [data-ogsc] .content { background: #ffffff !important; }
          [data-ogsc] .content h2 { color: #1e293b !important; }
          [data-ogsc] .content p { color: #475569 !important; }
          [data-ogsc] .code { color: #8b5cf6 !important; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌙 DreamWise</h1>
            <p>欢迎加入梦境解析平台</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>感谢您注册DreamWise账户。为了确保账户安全，请使用以下验证码完成邮箱验证：</p>
            
            <div class="verification-code">
              <p>您的验证码是：</p>
              <div class="code">${verificationCode}</div>
              <p>验证码有效期为10分钟</p>
            </div>
            
            <p>如果您没有注册DreamWise账户，请忽略此邮件。</p>
            
            <p>祝您使用愉快！<br><strong>DreamWise团队</strong></p>
          </div>
          <div class="footer">
            <p>此邮件由系统自动发送，请勿回复。</p>
            <p>© 2025 DreamWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 密码重置邮件模板
  getPasswordResetTemplate(username, verificationCode) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>重置密码 - DreamWise</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          
          .header { 
            background: linear-gradient(135deg, #f59e0b, #ef4444); 
            padding: 40px 30px; 
            text-align: center; 
          }
          
          .header h1 { 
            color: #ffffff !important; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .header p {
            color: rgba(255,255,255,0.95) !important;
            margin: 10px 0 0 0;
            font-size: 16px;
          }
          
          .content { 
            padding: 40px 30px; 
            background: #ffffff;
          }
          
          .content h2 {
            color: #1e293b !important;
            font-size: 24px;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          
          .content p {
            color: #475569 !important;
            font-size: 16px;
            margin: 16px 0;
          }
          
          .verification-code { 
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border: 2px solid #ef4444; 
            border-radius: 12px; 
            padding: 30px 20px; 
            text-align: center; 
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
          }
          
          .verification-code p {
            color: #64748b !important;
            font-size: 14px;
            margin: 0;
            font-weight: 500;
          }
          
          .code { 
            font-size: 36px; 
            font-weight: 700; 
            color: #ef4444 !important; 
            letter-spacing: 8px; 
            margin: 15px 0;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            text-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
          }
          
          .warning { 
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border-left: 4px solid #f59e0b; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
          }
          
          .warning p {
            margin: 0;
          }
          
          .warning p:first-child {
            color: #92400e !important;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .warning p:last-child {
            color: #78350f !important;
          }
          
          .footer { 
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 30px; 
            text-align: center; 
          }
          
          .footer p {
            color: #64748b !important; 
            font-size: 14px;
            margin: 8px 0;
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body { 
              background-color: #0f172a !important;
              color: #e2e8f0 !important;
            }
            
            .container {
              background: #1e293b !important;
              border-color: #334155 !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
            }
            
            .content {
              background: #1e293b !important;
            }
            
            .content h2 {
              color: #f1f5f9 !important;
            }
            
            .content p {
              color: #cbd5e1 !important;
            }
            
            .verification-code {
              background: linear-gradient(135deg, #450a0a, #7f1d1d) !important;
              border-color: #ef4444 !important;
            }
            
            .verification-code p {
              color: #94a3b8 !important;
            }
            
            .warning {
              background: linear-gradient(135deg, #451a03, #78350f) !important;
            }
            
            .warning p:first-child {
              color: #fbbf24 !important;
            }
            
            .warning p:last-child {
              color: #fde68a !important;
            }
            
            .footer {
              background: #0f172a !important;
              border-color: #334155 !important;
            }
            
            .footer p {
              color: #94a3b8 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 DreamWise</h1>
            <p>密码重置请求</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>我们收到了您的密码重置请求。请使用以下验证码来重置您的密码：</p>
            
            <div class="verification-code">
              <p>密码重置验证码：</p>
              <div class="code">${verificationCode}</div>
              <p>验证码有效期为10分钟</p>
            </div>
            
            <div class="warning">
              <p>🚨 安全提醒：</p>
              <p>如果您没有请求重置密码，请立即联系我们的客服团队。</p>
            </div>
            
            <p>为了您的账户安全，请不要将验证码分享给任何人。</p>
            
            <p><strong>DreamWise安全团队</strong></p>
          </div>
          <div class="footer">
            <p>此邮件由系统自动发送，请勿回复。</p>
            <p>© 2025 DreamWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 密码修改邮件模板
  getPasswordChangeTemplate(username, verificationCode) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>确认密码修改 - DreamWise</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          
          .header { 
            background: linear-gradient(135deg, #10b981, #3b82f6); 
            padding: 40px 30px; 
            text-align: center; 
          }
          
          .header h1 { 
            color: #ffffff !important; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .header p {
            color: rgba(255,255,255,0.95) !important;
            margin: 10px 0 0 0;
            font-size: 16px;
          }
          
          .content { 
            padding: 40px 30px; 
            background: #ffffff;
          }
          
          .content h2 {
            color: #1e293b !important;
            font-size: 24px;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          
          .content p {
            color: #475569 !important;
            font-size: 16px;
            margin: 16px 0;
          }
          
          .verification-code { 
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            border: 2px solid #10b981; 
            border-radius: 12px; 
            padding: 30px 20px; 
            text-align: center; 
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
          }
          
          .verification-code p {
            color: #64748b !important;
            font-size: 14px;
            margin: 0;
            font-weight: 500;
          }
          
          .code { 
            font-size: 36px; 
            font-weight: 700; 
            color: #10b981 !important; 
            letter-spacing: 8px; 
            margin: 15px 0;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            text-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
          }
          
          .footer { 
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 30px; 
            text-align: center; 
          }
          
          .footer p {
            color: #64748b !important; 
            font-size: 14px;
            margin: 8px 0;
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body { 
              background-color: #0f172a !important;
              color: #e2e8f0 !important;
            }
            
            .container {
              background: #1e293b !important;
              border-color: #334155 !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
            }
            
            .content {
              background: #1e293b !important;
            }
            
            .content h2 {
              color: #f1f5f9 !important;
            }
            
            .content p {
              color: #cbd5e1 !important;
            }
            
            .verification-code {
              background: linear-gradient(135deg, #064e3b, #065f46) !important;
              border-color: #10b981 !important;
            }
            
            .verification-code p {
              color: #94a3b8 !important;
            }
            
            .footer {
              background: #0f172a !important;
              border-color: #334155 !important;
            }
            
            .footer p {
              color: #94a3b8 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 DreamWise</h1>
            <p>密码修改确认</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>您正在修改DreamWise账户密码。为了确保账户安全，请使用以下验证码确认此操作：</p>
            
            <div class="verification-code">
              <p>密码修改验证码：</p>
              <div class="code">${verificationCode}</div>
              <p>验证码有效期为10分钟</p>
            </div>
            
            <p>如果您没有进行此操作，请立即联系我们的客服团队。</p>
            
            <p>感谢您对账户安全的重视！<br><strong>DreamWise安全团队</strong></p>
          </div>
          <div class="footer">
            <p>此邮件由系统自动发送，请勿回复。</p>
            <p>© 2025 DreamWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();