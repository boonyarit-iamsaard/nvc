import { formatCurrency } from '~/common/helpers/currency';
import type { GetMembershipsResult } from '~/features/memberships/memberships.schema';

import type { ListRoomTypesResult } from '../../room-types.schema';

type RoomTypeBrowserPriceProps = {
  roomType: ListRoomTypesResult[number];
  memberships: GetMembershipsResult;
};

export function RoomTypeBrowserPrice({
  roomType,
  memberships,
}: RoomTypeBrowserPriceProps) {
  return (
    <div className="text-right">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">From</div>
        <div className="text-2xl font-semibold">
          {formatCurrency(roomType.price.weekday)}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            THB
          </span>
        </div>
        <div className="text-sm text-muted-foreground">per night</div>
      </div>

      <div className="mt-4 space-y-1 text-right text-sm">
        <div>
          • Weekday rates from {formatCurrency(roomType.price.weekday)} THB
        </div>
        <div>
          • Weekend rates from {formatCurrency(roomType.price.weekend)} THB
        </div>
        <div className="text-muted-foreground">
          * Member discounts up to{' '}
          {Math.max(...memberships.map((m) => m.roomDiscount))}% available
        </div>
      </div>
    </div>
  );
}
