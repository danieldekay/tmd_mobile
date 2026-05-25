/**
 * Landing Page Features Data
 *
 * Configuration for feature cards displayed on the landing page.
 * Each feature highlights a key capability of TMD Mobile.
 */

export interface LandingFeature {
	id: string;
	title: string;
	description: string;
	icon: string;
}

export const LANDING_FEATURES: LandingFeature[] = [
	{
		id: 'events',
		title: 'Curated Events & Calendar',
		description: 'Browse marathons by date, location, and category with integrated calendar view.',
		icon: '📅',
	},
	{
		id: 'teachers',
		title: 'Teachers & DJs Directory',
		description: 'Discover instructors and performers featured at events you love.',
		icon: '🎵',
	},
	{
		id: 'series',
		title: 'Event Series Tracking',
		description: 'Follow multi-day events and recurring series across the globe.',
		icon: '🔗',
	},
	{
		id: 'notifications',
		title: 'Instant Notifications',
		description: 'Get alerts for new events, updates, and registration opportunities.',
		icon: '🔔',
	},
	{
		id: 'offline',
		title: 'Offline Event Access',
		description: 'Access saved events and browse cached data without internet connection.',
		icon: '📱',
	},
];
