import { drizzleQuery } from '$lib/database/db';
import { events, rsvps } from '$lib/database/schema';
import { eq, asc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const eventId = params.id;

	if (!eventId) {
		throw error(404, 'EventId not found');
	}

	try {
		// Fetch event and RSVPs in parallel
		const [eventData, rsvpData] = await Promise.all([
			drizzleQuery.select().from(events).where(eq(events.id, eventId)).limit(1),
			drizzleQuery
				.select()
				.from(rsvps)
				.where(eq(rsvps.eventId, eventId))
				.orderBy(asc(rsvps.createdAt))
		]);

		if (!eventData[0]) {
			throw error(404, 'Event not found');
		}

		const event = eventData[0];
		const eventRsvps = rsvpData;

		// Transform the data to match the expected interface
		const transformedEvent = {
			id: event.id,
			name: event.name,
			date: event.date,
			time: event.time,
			location: event.location,
			type: event.type,
			attendee_limit: event.attendeeLimit,
			visibility: event.visibility,
			user_id: event.userId,
			created_at: event.createdAt?.toISOString() || new Date().toISOString(),
			updated_at: event.updatedAt?.toISOString() || new Date().toISOString()
		};

		const transformedRsvps = eventRsvps.map((rsvp) => ({
			id: rsvp.id,
			event_id: rsvp.eventId,
			name: rsvp.name,
			user_id: rsvp.userId,
			created_at: rsvp.createdAt?.toISOString() || new Date().toISOString()
		}));

		const userId = cookies.get('cactoideUserId');

		return {
			event: transformedEvent,
			rsvps: transformedRsvps,
			userId: userId
		};
	} catch (err) {
		if (err instanceof Response) throw err; // This is the 404 error

		console.error('Error loading event:', err);
		throw error(500, 'Failed to load event');
	}
};

export const actions: Actions = {
	addRSVP: async ({ request, params, cookies }) => {
		const eventId = params.id;
		const formData = await request.formData();

		const name = formData.get('newAttendeeName') as string;
		const userId = cookies.get('cactoideUserId');

		if (!name?.trim() || !userId) {
			return fail(400, { error: 'Name and user ID are required' });
		}

		try {
			// Check if event exists and get its details
			const [eventData] = await drizzleQuery.select().from(events).where(eq(events.id, eventId));
			if (!eventData) {
				return fail(404, { error: 'Event not found' });
			}

			// Check if event is full (for limited type events)
			if (eventData.type === 'limited' && eventData.attendeeLimit) {
				const currentRSVPs = await drizzleQuery
					.select()
					.from(rsvps)
					.where(eq(rsvps.eventId, eventId));
				if (currentRSVPs.length >= eventData.attendeeLimit) {
					return fail(400, { error: 'Event is full' });
				}
			}

			// Check if name is already in the list
			const existingRSVPs = await drizzleQuery
				.select()
				.from(rsvps)
				.where(eq(rsvps.eventId, eventId));
			if (existingRSVPs.some((rsvp) => rsvp.name.toLowerCase() === name.toLowerCase())) {
				return fail(400, { error: 'Name already exists for this event' });
			}

			// Add RSVP to database
			await drizzleQuery.insert(rsvps).values({
				eventId: eventId,
				name: name.trim(),
				userId: userId,
				createdAt: new Date()
			});

			return { success: true, type: 'add' };
		} catch (err) {
			console.error('Error adding RSVP:', err);
			return fail(500, { error: 'Failed to add RSVP' });
		}
	},

	removeRSVP: async ({ request }) => {
		const formData = await request.formData();

		const rsvpId = formData.get('rsvpId') as string;

		if (!rsvpId) {
			return fail(400, { error: 'RSVP ID is required' });
		}

		try {
			await drizzleQuery.delete(rsvps).where(eq(rsvps.id, rsvpId));
			return { success: true, type: 'remove' };
		} catch (err) {
			console.error('Error removing RSVP:', err);
			return fail(500, { error: 'Failed to remove RSVP' });
		}
	}
};
