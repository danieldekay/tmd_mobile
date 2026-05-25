export type ChangelogEntry = {
	version: string;
	date: string;
	title: string;
	items: string[];
};

export const changelog: ChangelogEntry[] = [
	{
		version: '0.1.0',
		date: '2026-05-05',
		title: 'Initial Public Release',
		items: [
			'Event browsing with advanced filters (country, date range, registration status, category)',
			'Event detail pages with full information, related DJs/teachers, and registration links',
			'DJ directory with profiles and related events',
			'Event series browsing and detail pages',
			'Calendar view of upcoming events with date navigation',
			'Map-based event discovery by location',
			'Save events for quick access across sessions',
			'Persistent PWA with offline support via service worker',
			'User authentication with TangoAtlas SSO',
			'Neo-brutalist design system with high contrast, accessible colors',
			'Responsive mobile-first layout optimized for 320px+ screens'
		]
	}
];
