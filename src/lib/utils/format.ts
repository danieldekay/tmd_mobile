/**
 * Shared formatting utilities for dates and locations.
 *
 * All functions accept primitive values, not domain objects — keeping this module
 * framework-agnostic and free of API-layer dependencies.
 */

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
};

const DATE_FORMAT_LONG: Intl.DateTimeFormatOptions = {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
};

function fmt(value: string, options: Intl.DateTimeFormatOptions = DATE_FORMAT): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return new Intl.DateTimeFormat('en', options).format(d);
}

/**
 * Format a date range from two ISO date strings.
 * When start and end are the same day the end is omitted.
 *
 * @example
 * formatDateRange('2025-03-20', '2025-03-22') // "20 Mar 2025 – 22 Mar 2025"
 * formatDateRange('2025-03-20', '2025-03-20') // "20 Mar 2025"
 * formatDateRange(undefined, undefined)        // "Date to be announced"
 */
export function formatDateRange(
	dateStart: string | undefined | null,
	dateEnd: string | undefined | null
): string {
	if (!dateStart) return 'Date to be announced';
	const start = fmt(dateStart);
	const end = dateEnd ? fmt(dateEnd) : '';
	return end && end !== start ? `${start} – ${end}` : start;
}

/**
 * Format a registration open date for display.
 * Uses long month format ("20 March 2025").
 */
export function formatRegistrationDate(dateStr: string | undefined | null): string {
	if (!dateStr) return '';
	return fmt(dateStr, DATE_FORMAT_LONG);
}

/**
 * Format a city/country pair into a single location string.
 *
 * @example
 * formatLocation('Berlin', 'Germany') // "Berlin, Germany"
 * formatLocation('Berlin', undefined) // "Berlin"
 * formatLocation(undefined, undefined) // "Location to be announced"
 */
export function formatLocation(
	city: string | undefined | null,
	country: string | undefined | null
): string {
	return [city, country].filter(Boolean).join(', ') || 'Location to be announced';
}
