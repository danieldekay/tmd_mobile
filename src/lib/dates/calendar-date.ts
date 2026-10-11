/**
 * Parse a WordPress/TMD calendar date as a local civil date, NOT UTC.
 *
 * Date.parse('2027-01-01') is UTC; in timezones west of Greenwich it can
 * display December 31. Using local noon also avoids most DST midnight jumps.
 * RFC3339 timestamps with a timezone are preserved as instants.
 */
export function parseCalendarDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  let date: Date;
  if (match) {
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 ||
        date.getDate() !== day) return null;
  } else {
    date = new Date(value);
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCalendarDate(
  value: string | undefined | null,
  options: Intl.DateTimeFormatOptions,
  locale = 'en'
): string {
  const date = parseCalendarDate(value);
  return date ? new Intl.DateTimeFormat(locale, options).format(date) : '';
}

export function calendarDay(value: string | undefined | null): string | undefined {
  const date = parseCalendarDate(value);
  if (!date) return undefined;
  return [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

export function todayCalendarDay(now = new Date()): string {
  return [
    String(now.getFullYear()).padStart(4, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');
}

/** Compare civil dates, not UTC instants, for an event-opening indicator. */
export function isFutureCalendarDay(
  value: string | undefined | null,
  now = new Date()
): boolean {
  const day = calendarDay(value);
  if (!day) return false;
  const today = todayCalendarDay(now);
  return day > today;
}
