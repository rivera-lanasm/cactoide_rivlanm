import { drizzleQuery } from '$lib/database/db';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { events } from '$lib/database/schema';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all public events ordered by creation date (newest first)
		const publicEvents = await drizzleQuery
			.select()
			.from(events)
			.where(eq(events.visibility, 'public'))
			.orderBy(desc(events.createdAt));

		// Transform the database events to match the expected Event interface
		const transformedEvents = publicEvents.map((event) => ({
			id: event.id,
			name: event.name,
			date: event.date, // Already in 'YYYY-MM-DD' format
			time: event.time, // Already in 'HH:MM:SS' format
			location: event.location,
			type: event.type,
			attendee_limit: event.attendeeLimit, // Note: schema uses camelCase
			visibility: event.visibility,
			user_id: event.userId, // Note: schema uses camelCase
			created_at: event.createdAt?.toISOString(),
			updated_at: event.updatedAt?.toISOString()
		}));

		return {
			events: transformedEvents
		};
	} catch (error) {
		console.error('Error loading public events:', error);

		// Return empty array on error to prevent page crash
		return {
			events: []
		};
	}
};
