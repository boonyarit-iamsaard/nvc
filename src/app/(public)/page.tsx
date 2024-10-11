import { env } from '~/env';

export default async function Page() {
  return (
    <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
      <h1 className="font-serif text-4xl font-bold">
        {env.NEXT_PUBLIC_APP_NAME}
      </h1>
    </div>
  );
}
