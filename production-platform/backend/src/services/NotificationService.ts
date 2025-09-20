import nodemailer from 'nodemailer';
import twilio from 'twilio';

export interface NotificationPayload {
  recipientId: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  message: string;
  metadata?: any;
}

export interface EmailNotification extends NotificationPayload {
  type: 'email';
  recipientEmail: string;
  subject: string;
  htmlContent?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface SMSNotification extends NotificationPayload {
  type: 'sms';
  recipientPhone: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class NotificationService {
  private emailTransporter?: nodemailer.Transporter;
  private twilioClient?: twilio.Twilio;
  private isInitialized = false;

  constructor() {
    // Constructor remains lightweight
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize email transporter
      await this.initializeEmailService();
      
      // Initialize SMS service
      await this.initializeSMSService();
      
      this.isInitialized = true;
      console.log('Notification service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  private async initializeEmailService(): Promise<void> {
    try {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('Email service not configured (missing SMTP credentials)');
        return;
      }

      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Verify connection
      await this.emailTransporter.verify();
      console.log('Email service connected successfully');
      
    } catch (error) {
      console.warn('Email service initialization failed:', error);
    }
  }

  private async initializeSMSService(): Promise<void> {
    try {
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn('SMS service not configured (missing Twilio credentials)');
        return;
      }

      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      console.log('SMS service initialized successfully');
      
    } catch (error) {
      console.warn('SMS service initialization failed:', error);
    }
  }

  // Email notification methods
  public async sendEmail(notification: EmailNotification): Promise<NotificationResult> {
    try {
      if (!this.emailTransporter) {
        throw new Error('Email service not available');
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@ubuntuhealth.io',
        to: notification.recipientEmail,
        subject: notification.subject,
        text: notification.message,
        html: notification.htmlContent || this.generateEmailHTML(notification.message),
        attachments: notification.attachments,
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
      };

    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // SMS notification methods
  public async sendSMS(notification: SMSNotification): Promise<NotificationResult> {
    try {
      if (!this.twilioClient) {
        throw new Error('SMS service not available');
      }

      const message = await this.twilioClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.recipientPhone,
      });

      return {
        success: true,
        messageId: message.sid,
      };

    } catch (error) {
      console.error('Failed to send SMS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Treatment-specific notifications
  public async notifyTreatmentRequest(
    patientEmail: string,
    treatmentType: string,
    estimatedCost: number
  ): Promise<NotificationResult> {
    const subject = 'Treatment Request Submitted - Ubuntu Health';
    const message = `
Your treatment request has been submitted successfully.

Treatment Type: ${treatmentType}
Estimated Cost: $${estimatedCost.toLocaleString()}

We are now matching you with potential sponsors. You will receive updates as sponsors express interest in supporting your treatment.

Visit your dashboard to track progress: https://ubuntuhealth.io/patient/dashboard

Best regards,
Ubuntu Health Team
    `.trim();

    return await this.sendEmail({
      recipientId: '',
      type: 'email',
      recipientEmail: patientEmail,
      subject,
      message,
    });
  }

  public async notifySponsorMatch(
    sponsorEmail: string,
    patientFirstName: string,
    treatmentType: string,
    requestedAmount: number
  ): Promise<NotificationResult> {
    const subject = 'New Treatment Sponsorship Opportunity - Ubuntu Health';
    const message = `
A new treatment sponsorship opportunity matches your preferences.

Patient: ${patientFirstName} (anonymized for privacy)
Treatment Type: ${treatmentType}
Requested Amount: $${requestedAmount.toLocaleString()}

This patient's profile matches your sponsorship criteria. Review the full details and consider supporting this life-changing treatment.

View Opportunity: https://ubuntuhealth.io/sponsor/opportunity

Thank you for making a difference,
Ubuntu Health Team
    `.trim();

    return await this.sendEmail({
      recipientId: '',
      type: 'email',
      recipientEmail: sponsorEmail,
      subject,
      message,
    });
  }

  public async notifyMilestoneUpdate(
    recipients: Array<{ email: string; role: 'patient' | 'sponsor' }>,
    treatmentType: string,
    milestoneTitle: string,
    status: 'completed' | 'verified'
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const recipient of recipients) {
      const subject = `Treatment Milestone ${status === 'completed' ? 'Completed' : 'Verified'} - Ubuntu Health`;
      const message = `
Great news! A treatment milestone has been ${status}.

Treatment: ${treatmentType}
Milestone: ${milestoneTitle}
Status: ${status === 'completed' ? 'Completed by medical team' : 'Verified and funds released'}

${recipient.role === 'patient' 
  ? 'Your treatment is progressing well. Continue following your medical team\'s instructions.'
  : 'Thank you for supporting this patient\'s journey. Your contribution is making a real difference.'
}

View Progress: https://ubuntuhealth.io/${recipient.role}/dashboard

Best regards,
Ubuntu Health Team
      `.trim();

      const result = await this.sendEmail({
        recipientId: '',
        type: 'email',
        recipientEmail: recipient.email,
        subject,
        message,
      });

      results.push(result);
    }

    return results;
  }

  public async notifyDataReward(
    contributorEmail: string,
    rewardAmount: number,
    dataType: string
  ): Promise<NotificationResult> {
    const subject = 'Research Data Reward Received - Ubuntu Health';
    const message = `
Thank you for contributing to medical research!

Data Contribution: ${dataType}
Reward: ${rewardAmount} LIVES tokens

Your anonymized data is helping advance medical treatments and improve patient outcomes worldwide.

View Rewards: https://ubuntuhealth.io/research/rewards

Thank you for advancing medical science,
Ubuntu Health Team
    `.trim();

    return await this.sendEmail({
      recipientId: '',
      type: 'email',
      recipientEmail: contributorEmail,
      subject,
      message,
    });
  }

  // Utility methods
  private generateEmailHTML(textContent: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubuntu Health</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00D084, #00A86B); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
        .logo { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Ubuntu Health</div>
            <div>Decentralized Healthcare for All</div>
        </div>
        <div class="content">
            ${textContent.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
            <p>Ubuntu Health - Network State Healthcare Infrastructure</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  public async disconnect(): Promise<void> {
    if (this.emailTransporter) {
      this.emailTransporter.close();
    }
    console.log('Notification service disconnected');
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}