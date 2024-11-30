export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<TData = undefined> = {
  status: AsyncStatus;
  message: string | null;
  data: TData | null;
};

export const createInitialAsyncState = <TData = undefined>(
  data: TData | null = null,
): AsyncState<TData> => ({
  status: 'idle',
  message: null,
  data,
});
