'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { Button } from '~/common/components/ui/button';
import { Calendar } from '~/common/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/common/components/ui/popover';
import { cn } from '~/common/helpers/cn';

export type DateRangePickerRef = {
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
  openCalendar: () => void;
};

type DateRangePickerProps = Readonly<HTMLAttributes<HTMLDivElement>> & {
  placeholder?: string;
  dateRange: DateRange | undefined;
  disabled?: Matcher | Matcher[];
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onClear?: () => void;
};

export const DateRangePicker = forwardRef<
  DateRangePickerRef,
  DateRangePickerProps
>(function DateRangePicker(
  {
    className,
    placeholder = 'Please select date',
    dateRange,
    disabled,
    onDateRangeChange,
    onClear,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const showClearButton = dateRange?.from && dateRange?.to && onClear;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => buttonRef.current?.focus(),
      scrollIntoView: (options?: ScrollIntoViewOptions) =>
        buttonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          ...options,
        }),
      openCalendar: () => setOpen(true),
    }),
    [],
  );

  function getFormattedDate(date: DateRange | undefined, dateFormat: string) {
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start truncate text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="hidden truncate sm:block">
              {getFormattedDate(dateRange, 'PPP')}
            </span>
            <span className="truncate sm:hidden">
              {getFormattedDate(dateRange, 'MMM d, yyyy')}
            </span>
            {showClearButton && (
              <X
                className="ml-auto h-4 w-4 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
              />
            )}
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
});
