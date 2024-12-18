import { zodResolver } from '@hookform/resolvers/zod';
import { isBefore, setHours, startOfDay, startOfHour } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import { useUserSession } from '~/core/auth/hooks/use-user-session';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';
import { roomTypeFilterSchema } from '~/features/room-types/room-types.schema';

export function useRoomTypeBrowserFilter(
  onSubmit?: (filter: RoomTypeFilter) => void,
) {
  const { data: userSession } = useUserSession();
  const form = useForm<RoomTypeFilter>({
    resolver: zodResolver(roomTypeFilterSchema),
  });
  const [checkIn, checkOut] = form.watch(['checkIn', 'checkOut']);
  const dateRange = { from: checkIn, to: checkOut };
  const showSubmitButton = !!checkIn && !!checkOut;

  function handleClear() {
    form.reset();
  }

  function handleDateRangeChange(range?: DateRange) {
    form.setValue('checkIn', range?.from);
    form.setValue('checkOut', range?.to);
  }

  function handleSubmit(values: RoomTypeFilter) {
    const { checkIn, checkOut } = values;
    if (!checkIn || !checkOut) {
      return;
    }

    onSubmit?.({
      checkIn: startOfHour(setHours(checkIn, 13)),
      checkOut: startOfHour(setHours(checkOut, 12)),
      userId: userSession?.user.id,
    });
  }

  function isBeforeToday(date: Date) {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  }

  return {
    form,
    dateRange,
    showSubmitButton,
    handleClear,
    handleDateRangeChange,
    handleSubmit,
    isBeforeToday,
  };
}
