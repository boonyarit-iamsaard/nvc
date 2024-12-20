'use client';

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { FilterRoomTypesInput } from '~/common/common.schema';
import { Button } from '~/common/components/ui/button';
import type { DateRangePickerRef } from '~/common/components/ui/date-range-picker';
import { DateRangePicker } from '~/common/components/ui/date-range-picker';
import { Form } from '~/common/components/ui/form';
import { useRoomTypeFilterForm } from '~/common/hooks/use-room-type-filter-form';

type RoomTypeFilterProps = Readonly<{
  filter?: FilterRoomTypesInput;
  onClear?: () => void;
  ref?: ForwardedRef<DateRangePickerRef>;
}>;

export const RoomTypeFilterForm = forwardRef<
  DateRangePickerRef,
  Omit<RoomTypeFilterProps, 'ref'>
>(function RoomTypeFilter({ filter, onClear }, ref) {
  const {
    checkIn,
    checkOut,
    disabled,
    form,
    handleClear: handleDateRangeClear,
    handleDateRangeChange,
    handleSubmit,
    validateNotBeforeToday,
  } = useRoomTypeFilterForm(filter);

  // TODO: reconsider this necessity
  function handleClear() {
    handleDateRangeClear();
    onClear?.();
  }

  return (
    <Form {...form}>
      <div className="room-type-browser-filter">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-12">
            <div className="sm:col-span-9">
              <DateRangePicker
                ref={ref}
                dateRange={{
                  from: checkIn,
                  to: checkOut,
                }}
                disabled={validateNotBeforeToday}
                onDateRangeChange={handleDateRangeChange}
                onClear={handleClear}
              />
            </div>
            <Button
              type="submit"
              disabled={!disabled}
              className="h-14 rounded-none sm:col-span-3"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
});
