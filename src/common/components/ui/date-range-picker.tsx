'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { Calendar } from '~/common/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/common/components/ui/popover';
import { Separator } from '~/common/components/ui/separator';
import { cn } from '~/common/helpers/cn';

export type DateRangePickerRef = {
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
  openCalendar: () => void;
};

type DateRangePickerProps = Readonly<HTMLAttributes<HTMLDivElement>> & {
  dateRange: DateRange | undefined;
  disabled?: Matcher | Matcher[];
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onClear?: () => void;
};

type DateInputProps = Readonly<{
  date: string;
}>;

function DateInput({ date }: DateInputProps) {
  return (
    <div className="flex h-14 w-full items-center px-3 py-2 text-left text-sm">
      <CalendarIcon className="mr-4 size-4" />
      <span className="hidden truncate sm:block">{date}</span>
      <span className="block truncate sm:hidden">{date}</span>
    </div>
  );
}

export const DateRangePicker = forwardRef<
  DateRangePickerRef,
  DateRangePickerProps
>(function DateRangePicker(
  { className, dateRange, disabled, onDateRangeChange },
  ref,
) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  function getDisplayDate(date: Date | undefined, placeholder: string): string {
    if (!date) {
      return placeholder;
    }

    return format(date, 'LLLL dd, yyyy');
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    onDateRangeChange?.(range);
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={buttonRef}
            id="date"
            className={cn(
              'flex flex-col bg-background ring-1 ring-inset ring-border sm:flex-row',
              !dateRange && 'text-muted-foreground',
            )}
          >
            <DateInput date={getDisplayDate(dateRange?.from, 'Check-in')} />
            <Separator orientation="vertical" className="hidden sm:block" />
            <Separator orientation="horizontal" className="sm:hidden" />
            <DateInput date={getDisplayDate(dateRange?.to, 'Check-out')} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-none p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            appearance="luxury"
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
