import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email configuration
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@inspekta.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Inspekta Platform';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Email types
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Base email sender function
export async function sendEmail(emailData: EmailTemplate): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    console.log('Email would have been sent to:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('HTML Content:', emailData.html);
    return false;
  }

  try {
    const msg = {
      to: emailData.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || stripHtmlTags(emailData.html),
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sgError = error as any;
      console.error('SendGrid response body:', sgError.response?.body);
    }
    return false;
  }
}

// Email verification email
export async function sendVerificationEmail(
  email: string, 
  name: string, 
  verificationToken: string
): Promise<boolean> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${verificationToken}`;
  
  const emailData: EmailTemplate = {
    to: email,
    subject: 'Verify Your Inspekta Account',
    html: generateVerificationEmailHTML(name, verificationUrl),
  };

  return await sendEmail(emailData);
}

// Password reset email
export async function sendPasswordResetEmail(
  email: string, 
  name: string, 
  resetToken: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;
  
  const emailData: EmailTemplate = {
    to: email,
    subject: 'Reset Your Inspekta Password',
    html: generatePasswordResetEmailHTML(name, resetUrl),
  };

  return await sendEmail(emailData);
}

// Welcome email after successful verification
export async function sendWelcomeEmail(
  email: string, 
  name: string, 
  role: string
): Promise<boolean> {
  const dashboardUrl = `${APP_URL}/${role.toLowerCase()}`;
  
  const emailData: EmailTemplate = {
    to: email,
    subject: 'Welcome to Inspekta! Your Account is Ready',
    html: generateWelcomeEmailHTML(name, role, dashboardUrl),
  };

  return await sendEmail(emailData);
}

// HTML Email Templates

function generateVerificationEmailHTML(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Inspekta Account</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
            .logo { font-size: 28px; font-weight: bold; margin: 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 class="logo">🏠 Inspekta</h1>
            <p>Real Estate Made Transparent</p>
        </div>
        
        <div class="content">
            <h2>Hi ${name}!</h2>
            
            <p>Welcome to Inspekta! We're excited to have you join our community of property seekers, agents, and inspectors.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify My Account</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${verificationUrl}
            </p>
            
            <p><strong>This verification link will expire in 24 hours</strong> for security purposes.</p>
            
            <p>If you didn't create an account with Inspekta, you can safely ignore this email.</p>
            
            <p>Best regards,<br>
            The Inspekta Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Inspekta Platform. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@inspekta.com">support@inspekta.com</a></p>
        </div>
    </body>
    </html>
  `;
}

function generatePasswordResetEmailHTML(name: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Inspekta Password</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
            .logo { font-size: 28px; font-weight: bold; margin: 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 class="logo">🔐 Inspekta</h1>
            <p>Password Reset Request</p>
        </div>
        
        <div class="content">
            <h2>Hi ${name}!</h2>
            
            <p>We received a request to reset your password for your Inspekta account.</p>
            
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
            </p>
            
            <div class="warning">
                <strong>⚠️ Important Security Information:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This reset link will expire in <strong>15 minutes</strong></li>
                    <li>The link can only be used once</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password remains unchanged until you complete the reset</li>
                </ul>
            </div>
            
            <p>If you're having trouble accessing your account or need assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            The Inspekta Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Inspekta Platform. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@inspekta.com">support@inspekta.com</a></p>
        </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmailHTML(name: string, role: string, dashboardUrl: string): string {
  const roleMessages = {
    CLIENT: 'Start browsing properties and schedule inspections',
    AGENT: 'Begin listing properties and managing your portfolio',
    INSPECTOR: 'Accept inspection jobs and start earning',
    COMPANY_ADMIN: 'Manage your team and company settings',
    PLATFORM_ADMIN: 'Access platform administration tools'
  };

  const message = roleMessages[role as keyof typeof roleMessages] || 'Access your dashboard';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Inspekta!</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
            .logo { font-size: 28px; font-weight: bold; margin: 0; }
            .features { background: #fff; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .feature { margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 class="logo">🎉 Welcome to Inspekta!</h1>
            <p>Your account is ready to use</p>
        </div>
        
        <div class="content">
            <h2>Hi ${name}!</h2>
            
            <p>Congratulations! Your email has been verified and your Inspekta account is now active.</p>
            
            <p>As a <strong>${role.toLowerCase()}</strong>, you can now ${message.toLowerCase()}.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" class="button">Go to My Dashboard</a>
            </div>
            
            <div class="features">
                <h3>🚀 What you can do now:</h3>
                ${getFeatureList(role)}
            </div>
            
            <p>If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.</p>
            
            <p>Welcome aboard!<br>
            The Inspekta Team</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Inspekta Platform. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@inspekta.com">support@inspekta.com</a></p>
        </div>
    </body>
    </html>
  `;
}

function getFeatureList(role: string): string {
  const features = {
    CLIENT: [
      '🔍 Browse thousands of verified properties',
      '📅 Schedule virtual or physical inspections',
      '💾 Save your favorite properties',
      '📊 Track your inspection history'
    ],
    AGENT: [
      '🏠 List and manage your properties',
      '📈 Track your earnings and performance',
      '👥 Connect with potential clients',
      '📋 Manage inspection requests'
    ],
    INSPECTOR: [
      '💼 Accept inspection jobs in your area',
      '💰 Track your earnings and payments',
      '⭐ Build your reputation with ratings',
      '📱 Manage your schedule efficiently'
    ],
    COMPANY_ADMIN: [
      '🏢 Manage your company profile',
      '👨‍💼 Add and manage team members',
      '📊 View company analytics',
      '⚙️ Configure company settings'
    ],
    PLATFORM_ADMIN: [
      '🛠️ Access platform administration',
      '📈 View system analytics',
      '👥 Manage all users and companies',
      '⚙️ Configure platform settings'
    ]
  };

  const roleFeatures = features[role as keyof typeof features] || features.CLIENT;
  return roleFeatures.map(feature => `<div class="feature">${feature}</div>`).join('');
}

// Utility function to strip HTML tags for text version
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}