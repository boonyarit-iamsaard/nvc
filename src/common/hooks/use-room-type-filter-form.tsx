import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isBefore, startOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import {
  roomTypeFilterInputSchema,
  type RoomTypeFilterInput,
} from '~/common/common.schema';

export function useRoomTypeFilterForm(filter?: RoomTypeFilterInput) {
  const router = useRouter();

  const form = useForm<RoomTypeFilterInput>({
    resolver: zodResolver(roomTypeFilterInputSchema),
  });
  const [checkIn, checkOut] = form.watch(['checkIn', 'checkOut']);
  const disabled = !!checkIn && !!checkOut;

  function handleClear() {
    form.reset();
  }

  function handleDateRangeChange(range?: DateRange) {
    form.setValue('checkIn', range?.from);
    form.setValue('checkOut', range?.to);
  }

  function handleSubmit(values: RoomTypeFilterInput) {
    const { checkIn, checkOut } = values;
    if (!checkIn || !checkOut) {
      return;
    }

    const params = new URLSearchParams();
    params.set('check-in', format(checkIn, 'yyyy-MM-dd'));
    params.set('check-out', format(checkOut, 'yyyy-MM-dd'));

    const url = `/rooms?${params.toString()}`;

    router.push(url);
  }

  function validateNotBeforeToday(date: Date) {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  }

  useEffect(() => {
    form.setValue('checkIn', filter?.checkIn);
    form.setValue('checkOut', filter?.checkOut);

    return () => {
      form.reset();
    };
  }, [filter, form]);

  return {
    checkIn,
    checkOut,
    disabled,
    form,
    handleClear,
    handleDateRangeChange,
    handleSubmit,
    validateNotBeforeToday,
  };
}
