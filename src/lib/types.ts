export type TmdPerson = {
	id: number;
	name: string;
	url?: string;
};

// DTO for the event list view
export type TmdEventSummary = {
	id: number;
	title: string;
	slug?: string;
	dateStart?: string;
	dateEnd?: string;
	registrationDate?: string;
	city?: string;
	country?: string;
	venue?: string;
	lat?: number;
	lng?: number;
	badges: string[];
};

// Filter parameters for the event list
export type TmdEventFilters = {
	country?: string;
	city?: string;
	dateAfter?: string;
	dateBefore?: string;
	registrationState?: 'open' | 'upcoming' | 'all';
};

// Normalised location for map marker use
export type TmdEventLocation = {
	id: number;
	title: string;
	lat: number;
	lng: number;
	city?: string;
	country?: string;
};

export type TmdContactLink = {
	label: string;
	href: string;
};

// Full DTO for the event detail view
export type TmdEventDetail = TmdEventSummary & {
	registrationDate?: string;
	price?: string;
	currency?: string;
	website?: string;
	contactLinks: TmdContactLink[];
	socialLinks: TmdContactLink[];
	features: string[];
	djs: TmdPerson[];
	teachers: TmdPerson[];
	series: TmdPerson[];
};

export type TmdEvent = {
	id: number;
	title: string;
	link?: string;
	slug?: string;
	startDate?: string;
	endDate?: string;
	registrationStartDate?: string;
	city?: string;
	country?: string;
	venueName?: string;
	website?: string;
	email?: string;
	facebookEvent?: string;
	facebookGroup?: string;
	facebookPage?: string;
	price?: string;
	currency?: string;
	features: string[];
	relationships: {
		djs: TmdPerson[];
		teachers: TmdPerson[];
		series: TmdPerson[];
	};
};

// DJ summary for list view
export type TmdDj = {
	id: number;
	title: string;
	slug?: string;
	city?: string;
	country?: string;
	website?: string;
	socialLinks: TmdContactLink[];
};

// DJ detail with optional biography
export type TmdDjDetail = TmdDj & {
	bio?: string;
};

// Slim edition DTO used in event series detail
export type TmdSeriesEdition = {
	id: number;
	title: string;
	dateStart?: string;
	dateEnd?: string;
	city?: string;
	country?: string;
};

// Event series detail
export type TmdEventSeries = {
	id: number;
	title: string;
	slug?: string;
	description?: string;
	city?: string;
	country?: string;
	editions: TmdSeriesEdition[];
};

export type TmdApiRecord = Record<string, unknown>;

export type FetchEventsOptions = {
	limit?: number;
	country?: string;
	futureOnly?: boolean;
};

export type RoadmapPhase = {
	name: string;
	window: string;
	outcome: string;
	items: string[];
};
