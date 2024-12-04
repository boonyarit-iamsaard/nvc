export type SendMailParams = {
  subject: string;
  to: string | string[];
  html: string;
};

export type SendEmailVerificationParams = {
  name: string;
  email: string;
  initialPassword: string;
  verificationUrl: string;
};

export type SendBookingConfirmationEmailParams = {
  guestName: string;
  guestEmail: string;
  bookingNumber: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
};
