const lkr = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export const formatLkr = (amount: number) => `LKR ${lkr.format(amount)}`;
