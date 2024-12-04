'use client';

import { type HTMLAttributes } from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { Button } from '~/common/components/ui/button';
import { Calendar } from '~/common/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/common/components/ui/popover';
import { cn } from '~/common/helpers/cn';

type DateRangePickerProps = Readonly<HTMLAttributes<HTMLDivElement>> & {
  placeholder?: string;
  dateRange: DateRange | undefined;
  disabled?: Matcher | Matcher[];
  onDateRangeChange?: (range: DateRange | undefined) => void;
};

export function DateRangePicker({
  className,
  placeholder = 'Please select date',
  dateRange,
  disabled,
  onDateRangeChange,
}: DateRangePickerProps) {
  function getFormattedDate(date: DateRange | undefined) {
    const dateFormat = 'PPP';
    if (!date?.from && !date?.to) {
      return placeholder;
    }

    if (date.from && date.to) {
      return `${format(date.from, dateFormat)} - ${format(date.to, dateFormat)}`;
    }

    if (date.from) {
      return format(date.from, dateFormat);
    }
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    onDateRangeChange?.(range);
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{getFormattedDate(dateRange)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
