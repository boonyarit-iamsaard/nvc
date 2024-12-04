'use client';

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

import { Button } from '~/common/components/ui/button';
import type { DateRangePickerRef } from '~/common/components/ui/date-range-picker';
import { DateRangePicker } from '~/common/components/ui/date-range-picker';
import { Form } from '~/common/components/ui/form';
import { cn } from '~/common/helpers/cn';

import { useRoomTypeBrowserFilter } from '../../hooks/use-room-type-browser-filter';
import type { RoomTypeFilter } from '../../room-types.schema';

type RoomTypeBrowserFilterProps = Readonly<{
  onSubmit?: (filter: RoomTypeFilter) => void;
  ref?: ForwardedRef<DateRangePickerRef>;
}>;

export const RoomTypeBrowserFilter = forwardRef<
  DateRangePickerRef,
  Omit<RoomTypeBrowserFilterProps, 'ref'>
>(function RoomTypeBrowserFilter({ onSubmit }, ref) {
  const {
    dateRange,
    form,
    showSubmitButton,
    handleClear,
    handleDateRangeChange,
    handleSubmit,
    isBeforeToday,
  } = useRoomTypeBrowserFilter(onSubmit);

  return (
    <Form {...form}>
      <div className="room-type-browser-filter mx-auto w-full max-w-screen-sm">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <DateRangePicker
                ref={ref}
                dateRange={dateRange}
                disabled={isBeforeToday}
                onDateRangeChange={handleDateRangeChange}
                placeholder="Select your stay"
                onClear={handleClear}
              />
            </div>
            <div className="w-full sm:w-auto">
              {/* TODO: reconsider preserving space for submit button */}
              <Button
                type="submit"
                disabled={!showSubmitButton}
                className={cn(
                  'w-full sm:w-auto',
                  !showSubmitButton && 'invisible',
                )}
              >
                See availability
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
});
