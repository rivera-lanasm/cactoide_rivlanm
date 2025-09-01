import type { Event } from './types';

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}/${month}/${day}`;
};

export const formatTime = (timeString: string): string => {
	const [hours, minutes] = timeString.split(':');
	return `${hours}:${minutes}`;
};

// Helper function to check if an event is within a time range
export const isEventInTimeRange = (event: Event, timeFilter: string): boolean => {
	if (timeFilter === 'any') return true;

	const eventDate = new Date(`${event.date}T${event.time}`);
	const now = new Date();

	// Handle temporal status filters
	if (timeFilter === 'upcoming') {
		return eventDate >= now;
	}

	if (timeFilter === 'past') {
		return eventDate < now;
	}

	// Handle time range filters
	const ranges: Record<string, Date> = {
		'next-week': new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
		'next-month': new Date(new Date(now).setMonth(now.getMonth() + 1))
	};

	const endDate = ranges[timeFilter];
	return endDate ? eventDate >= now && eventDate <= endDate : true;
};
