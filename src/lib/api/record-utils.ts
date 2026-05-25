/**
 * Low-level record accessor utilities for the TMD API layer.
 *
 * These are internal helpers shared by tmd-normalize.ts. They are NOT part of
 * the public $lib/api/tmd surface — route pages must not import from here.
 */
import type { TmdApiRecord } from '$lib/types';

export function isRecord(value: unknown): value is TmdApiRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getRecord(record: TmdApiRecord, key: string): TmdApiRecord {
	const value = record[key];
	return isRecord(value) ? value : {};
}

export function getString(record: TmdApiRecord, keys: string[]): string | undefined {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}
	return undefined;
}

export function getNumber(record: TmdApiRecord, keys: string[]): number | undefined {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string') {
			const parsed = Number.parseInt(value, 10);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
	}
	return undefined;
}

export function getBoolean(record: TmdApiRecord, key: string): boolean | undefined {
	const value = record[key];
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'number') {
		return value === 1;
	}
	if (typeof value === 'string') {
		return ['1', 'true', 'yes'].includes(value.toLowerCase());
	}
	return undefined;
}

export function getTitle(record: TmdApiRecord): string {
	const title = record.title;

	if (typeof title === 'string') {
		return title;
	}

	if (isRecord(title)) {
		return getString(title, ['rendered', 'raw']) ?? 'Untitled event';
	}

	return getString(record, ['event_name', 'name']) ?? 'Untitled event';
}

export function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}
