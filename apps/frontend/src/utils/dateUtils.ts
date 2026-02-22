export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a YYYY-MM-DD string to "MMM YY" (e.g., "Jan 24")
 * safely handling timezone issues by parsing as local date.
 */
export const formatMonthYear = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  // Use local date constructor to avoid UTC shift
  const date = new Date(year, month - 1, day || 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};
