import { format } from 'date-fns';

export function formatDisplayDatetime(date?: Date) {
  if (date) {
    const formattedDate = format(date, 'LLLL dd, yyyy');
    const formattedTime = format(date, 'h:mm a');

    return {
      date: formattedDate,
      time: formattedTime,
    };
  }

  return {
    date: '',
    time: '',
  };
}
