import { Skeleton } from '~/components/ui/skeleton';

export function RoomTypeItemPlaceholder() {
  return (
    <li className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="relative aspect-[3/2] w-full bg-border md:aspect-square md:w-1/4" />
        <div className="flex flex-col space-y-4 p-6 md:w-3/4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    </li>
  );
}
