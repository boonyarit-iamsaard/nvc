import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '~/env';

import { renderSampleEmailTemplate } from './templates/sample-email.template';

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

  async sendEmail(): Promise<SMTPTransport.SentMessageInfo> {
    const to = ['boonyarit.iamsaard@gmail.com'];
    const subject = 'Welcome to Naturist Vacation Club';
    const html = await renderSampleEmailTemplate();

    return this.transporter.sendMail({
      from: this.mailFrom,
      to,
      subject,
      html,
    });
  }
}
