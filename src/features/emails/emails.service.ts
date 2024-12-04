import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '~/core/configs/app.env';

import type {
  SendBookingConfirmationEmailParams,
  SendEmailVerificationParams,
  SendMailParams,
} from './emails.schema';
import { renderBookingConfirmationTemplate } from './templates/booking-confirmation.template';
import { renderEmailVerificationTemplate } from './templates/email-verification.template';

export class EmailsService {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  private readonly mailFromAddress: string;
  private readonly mailFromName: string;
  private readonly mailFrom: string;

  constructor() {
    this.mailFromAddress = env.MAIL_FROM_ADDRESS;
    this.mailFromName = env.MAIL_FROM_NAME;
    this.mailFrom = `${this.mailFromName} <${this.mailFromAddress}>`;

    this.transporter = createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html }: SendMailParams) {
    return this.transporter.sendMail({
      from: this.mailFrom,
      to,
      subject,
      html,
    });
  }

  async sendBookingConfirmationEmail(
    params: SendBookingConfirmationEmailParams,
  ) {
    const {
      guestName,
      guestEmail,
      bookingNumber,
      roomName,
      checkIn,
      checkOut,
      totalAmount,
    } = params;

    const html = await renderBookingConfirmationTemplate({
      guestName,
      bookingNumber,
      roomName,
      checkIn,
      checkOut,
      totalAmount,
    });

    return this.sendEmail({
      to: guestEmail,
      subject: 'Your Booking Confirmation',
      html,
    });
  }

  async sendEmailVerification(params: SendEmailVerificationParams) {
    const { name, email, initialPassword, verificationUrl } = params;

    const html = await renderEmailVerificationTemplate({
      name,
      email,
      initialPassword,
      verificationUrl,
    });

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Naturist Vacation Club - Verify Your Email',
      html,
    });
  }
}
