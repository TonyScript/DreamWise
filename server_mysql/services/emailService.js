const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.resend = new Resend('re_GUybAXRV_DcNYEC5bM6weuumHumdPaAzR');
    this.fromEmail = 'DreamWise <noreply@dreamwise.com>';
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
        <title>验证您的邮箱 - DreamWise</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
          .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; color: #e2e8f0; }
          .verification-code { background: rgba(139, 92, 246, 0.2); border: 2px solid #8b5cf6; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: 700; color: #8b5cf6; letter-spacing: 8px; margin: 10px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: rgba(0, 0, 0, 0.3); padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌙 DreamWise</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">欢迎加入梦境解析平台</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>感谢您注册DreamWise账户。为了确保账户安全，请使用以下验证码完成邮箱验证：</p>
            
            <div class="verification-code">
              <p style="margin: 0; color: #e2e8f0;">您的验证码是：</p>
              <div class="code">${verificationCode}</div>
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">验证码有效期为10分钟</p>
            </div>
            
            <p>如果您没有注册DreamWise账户，请忽略此邮件。</p>
            
            <p>祝您使用愉快！<br>DreamWise团队</p>
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
        <title>重置密码 - DreamWise</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
          .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; color: #e2e8f0; }
          .verification-code { background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: 700; color: #ef4444; letter-spacing: 8px; margin: 10px 0; }
          .warning { background: rgba(245, 158, 11, 0.2); border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .footer { background: rgba(0, 0, 0, 0.3); padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 DreamWise</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">密码重置请求</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>我们收到了您的密码重置请求。请使用以下验证码来重置您的密码：</p>
            
            <div class="verification-code">
              <p style="margin: 0; color: #e2e8f0;">密码重置验证码：</p>
              <div class="code">${verificationCode}</div>
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">验证码有效期为10分钟</p>
            </div>
            
            <div class="warning">
              <p style="margin: 0; color: #f59e0b;"><strong>安全提醒：</strong></p>
              <p style="margin: 5px 0 0 0; color: #e2e8f0;">如果您没有请求重置密码，请立即联系我们的客服团队。</p>
            </div>
            
            <p>为了您的账户安全，请不要将验证码分享给任何人。</p>
            
            <p>DreamWise安全团队</p>
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
        <title>确认密码修改 - DreamWise</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
          .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; color: #e2e8f0; }
          .verification-code { background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: 700; color: #10b981; letter-spacing: 8px; margin: 10px 0; }
          .footer { background: rgba(0, 0, 0, 0.3); padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 DreamWise</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">密码修改确认</p>
          </div>
          <div class="content">
            <h2>您好，${username}！</h2>
            <p>您正在修改DreamWise账户密码。为了确保账户安全，请使用以下验证码确认此操作：</p>
            
            <div class="verification-code">
              <p style="margin: 0; color: #e2e8f0;">密码修改验证码：</p>
              <div class="code">${verificationCode}</div>
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">验证码有效期为10分钟</p>
            </div>
            
            <p>如果您没有进行此操作，请立即联系我们的客服团队。</p>
            
            <p>感谢您对账户安全的重视！<br>DreamWise安全团队</p>
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