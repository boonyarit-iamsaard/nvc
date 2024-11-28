'use client';

import { Button } from '~/components/ui/button';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import { Form } from '~/components/ui/form';

import { useRoomTypeFilterForm } from '../../hooks/use-room-type-filter-form';
import type { RoomTypeFilter } from '../../room-types.schema';

type RoomTypeBrowserFilterProps = Readonly<{
  onSubmit?: (filter: RoomTypeFilter) => void;
}>;

export function RoomTypeBrowserFilter({
  onSubmit,
}: RoomTypeBrowserFilterProps) {
  const {
    dateRange,
    disabled,
    form,
    hasFilled,
    handleClear,
    handleDateRangeChange,
    handleSubmit,
  } = useRoomTypeFilterForm(onSubmit);

  return (
    <Form {...form}>
      <div className="mx-auto w-full max-w-screen-sm">
        <form className="block" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* TODO: fix responsive layout */}
          <div className="grid gap-4 sm:flex">
            <div className="grid sm:flex-1">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                placeholder="Select your stay"
              />
            </div>
            <div className="grid gap-2 sm:flex">
              <Button type="submit" disabled={disabled}>
                Check availability
              </Button>
              {hasFilled ? (
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}
