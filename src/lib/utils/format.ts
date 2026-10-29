const lkr = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export const formatLkr = (amount: number) => `LKR ${lkr.format(amount)}`;

const dateTime = new Intl.DateTimeFormat('en-LK', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Colombo',
});

export const formatDateTime = (date: Date) => dateTime.format(date);

export const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
