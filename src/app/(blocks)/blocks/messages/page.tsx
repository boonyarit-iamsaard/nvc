'use client';

import { ContentContainer } from '~/common/components/content-container';
import { ContentHeader } from '~/common/components/content-header';
import { Message } from '~/common/components/message';

export default function Page() {
  const handleClick = (variant: string, action: 'confirm' | 'cancel') => {
    console.log(`${variant} ${action} clicked`);
  };

  return (
    <ContentContainer layout="header" size="lg">
      <div className="space-y-8">
        <ContentHeader
          title="Message"
          description="A collection of message variants for different states and actions"
        />

        <div className="grid gap-4">
          <Message
            variant="success"
            title="Payment Successful"
            message="Thank you for your payment. Your order has been confirmed."
            confirmLabel="View Order"
            onConfirm={() => handleClick('success', 'confirm')}
          />

          <Message
            variant="error"
            title="Error Occurred"
            message="We couldn't process your request. Please try again."
            confirmLabel="Retry"
            cancelLabel="Cancel"
            onConfirm={() => handleClick('error', 'confirm')}
            onCancel={() => handleClick('error', 'cancel')}
          />

          <Message
            variant="warning"
            title="Session Expiring"
            message="Your session will expire in 5 minutes. Would you like to extend it?"
            confirmLabel="Extend Session"
            cancelLabel="Logout"
            onConfirm={() => handleClick('warning', 'confirm')}
            onCancel={() => handleClick('warning', 'cancel')}
          />

          <Message
            variant="info"
            title="Updates Available"
            message="A new version of the application is available."
            confirmLabel="Update Now"
            onConfirm={() => handleClick('info', 'confirm')}
          />

          <Message
            variant="action"
            title="Confirm Delete"
            message="Are you sure you want to delete this item? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Keep"
            onConfirm={() => handleClick('action', 'confirm')}
            onCancel={() => handleClick('action', 'cancel')}
          />
        </div>
      </div>
    </ContentContainer>
  );
}
