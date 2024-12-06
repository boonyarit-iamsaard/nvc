import Link from 'next/link';

import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';

export default function Page() {
  return (
    <Message
      title="Reset Password (Coming Soon)"
      message="This page is under construction. Please check back later."
    >
      <div className="flex justify-center">
        <Button asChild size="sm">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </Message>
  );
}
