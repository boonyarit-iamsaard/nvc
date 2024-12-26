'use client';

import { ContentContainer } from '~/common/components/content-container';
import { ContentHeader } from '~/common/components/content-header';
import type { MessageProps } from '~/common/components/message';
import { Message } from '~/common/components/message';

type MessageWithVariant = MessageProps & {
  variant: NonNullable<MessageProps['variant']>;
};

const messages: MessageWithVariant[] = [
  {
    variant: 'success',
    title: 'Payment Successful',
    message: 'Thank you for your payment. Your order has been confirmed.',
    confirmLabel: 'View Order',
  },
  {
    variant: 'error',
    title: 'Error Occurred',
    message: "We couldn't process your request. Please try again.",
    confirmLabel: 'Retry',
    cancelLabel: 'Cancel',
  },
  {
    variant: 'warning',
    title: 'Session Expiring',
    message:
      'Your session will expire in 5 minutes. Would you like to extend it?',
    confirmLabel: 'Extend Session',
    cancelLabel: 'Logout',
  },
  {
    variant: 'info',
    title: 'Updates Available',
    message: 'A new version of the application is available.',
    confirmLabel: 'Update Now',
  },
  {
    variant: 'action',
    title: 'Confirm Delete',
    message:
      'Are you sure you want to delete this item? This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
  },
];

export default function Page() {
  const handleClick = (variant: string, action: 'confirm' | 'cancel') => {
    console.log(`${variant} ${action} clicked`);
  };

  return (
    <ContentContainer layout="header" size="lg" className="relative">
      <div className="space-y-8">
        <ContentHeader
          title="Message"
          description="A collection of message variants for different states and actions"
        />

        <div className="grid gap-4">
          {messages.map((msg) => (
            <Message
              key={msg.title}
              variant={msg.variant}
              title={msg.title}
              message={msg.message}
              confirmLabel={msg.confirmLabel}
              cancelLabel={msg.cancelLabel}
              onConfirm={() => handleClick(msg.variant, 'confirm')}
              onCancel={
                msg.cancelLabel
                  ? () => handleClick(msg.variant, 'cancel')
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </ContentContainer>
  );
}
