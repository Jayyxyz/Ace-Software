export function formatDateTime(timestamp: string | Date): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);

  // Options for formatting date
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);

  // Format time to 12-hour format with AM/PM
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate} ${formattedTime}`;
}
