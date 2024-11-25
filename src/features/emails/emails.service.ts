import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '~/env';

export type SendMailParams = {
  subject: string;
  to: string | string[];
  html: string;
};

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
}
