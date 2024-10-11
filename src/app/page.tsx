import { Button } from '~/components/ui/button';
import { env } from '~/env';

export default async function Page() {
  return (
    <main className="grid min-h-screen flex-1 place-items-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="font-serif text-4xl font-bold">
          {env.NEXT_PUBLIC_APP_NAME}
        </h1>
        <Button>Click me</Button>
      </div>
    </main>
  );
}
