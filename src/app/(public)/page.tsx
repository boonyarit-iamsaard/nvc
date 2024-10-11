import { Button } from '~/components/ui/button';
import { env } from '~/env';

export default async function Page() {
  return (
    <main className="flex-1">
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">
          {env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <Button>Click me</Button>
      </div>
    </main>
  );
}
