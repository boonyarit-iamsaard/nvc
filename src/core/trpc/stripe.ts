import type { NextRequest } from 'next/server';

import { createCaller } from '../server/api/root';
import { createTRPCContext } from '../server/api/trpc';

export type WebhookContextCaller = ReturnType<typeof createCaller>;

export type WebhookContext = {
  payload: string;
  signature: string;
  caller: WebhookContextCaller;
};

export const createContext = async (
  req: NextRequest,
): Promise<WebhookContext> => {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    throw new Error('Signature is missing');
  }

  const trpcContext = await createTRPCContext({
    headers: new Headers({
      ...Object.fromEntries(req.headers.entries()),
      'x-internal-webhook': 'true',
    }),
  });

  const caller = createCaller(trpcContext);

  return {
    payload,
    signature,
    caller,
  };
};
