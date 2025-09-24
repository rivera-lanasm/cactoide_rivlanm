import { database } from '$lib/database/db';
import { events } from '$lib/database/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// Generate a random URL-friendly ID
function generateEventId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const date = formData.get('date') as string;
		const time = formData.get('time') as string;
		const location = formData.get('location') as string;
		const locationType = formData.get('location_type') as 'text' | 'maps';
		const locationUrl = formData.get('location_url') as string;
		const type = formData.get('type') as 'limited' | 'unlimited';
		const attendeeLimit = formData.get('attendee_limit') as string;
		const visibility = formData.get('visibility') as 'public' | 'private';
		const userId = cookies.get('cactoideUserId');

		// Validation
		const missingFields: string[] = [];

		if (!name?.trim()) missingFields.push('name');
		if (!date) missingFields.push('date');
		if (!time) missingFields.push('time');
		if (!location?.trim()) missingFields.push('location');
		if (!locationType) missingFields.push('location_type');
		if (locationType === 'maps' && !locationUrl?.trim()) missingFields.push('location_url');
		if (!userId) missingFields.push('userId');

		if (missingFields.length > 0) {
			return fail(400, {
				error: `Missing or empty fields: ${missingFields.join(', ')}`,
				values: {
					name,
					date,
					time,
					location,
					location_type: locationType,
					location_url: locationUrl,
					type,
					attendee_limit: attendeeLimit,
					visibility
				}
			});
		}

		if (new Date(date) < new Date()) {
			return fail(400, {
				error: 'Date cannot be in the past.',
				values: {
					name,
					date,
					time,
					location,
					location_type: locationType,
					location_url: locationUrl,
					type,
					attendee_limit: attendeeLimit,
					visibility
				}
			});
		}

		if (type === 'limited' && (!attendeeLimit || parseInt(attendeeLimit) < 2)) {
			return fail(400, {
				error: 'Limit must be at least 2 for limited events.',
				values: {
					name,
					date,
					time,
					location,
					location_type: locationType,
					location_url: locationUrl,
					type,
					attendee_limit: attendeeLimit,
					visibility
				}
			});
		}

		const eventId = generateEventId();

		await database
			.insert(events)
			.values({
				id: eventId,
				name: name.trim(),
				date: date,
				time: time,
				location: location.trim(),
				locationType: locationType,
				locationUrl: locationType === 'maps' ? locationUrl?.trim() : null,
				type: type,
				attendeeLimit: type === 'limited' ? parseInt(attendeeLimit) : null,
				visibility: visibility,
				userId: userId
			})
			.catch((error) => {
				console.error('Unexpected error', error);
				throw error;
			});

		throw redirect(303, `/event/${eventId}`);
	}
};
