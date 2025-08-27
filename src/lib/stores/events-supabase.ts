import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Event, CreateEventData, RSVP, DatabaseEvent, DatabaseRSVP } from '$lib/types';

// Store for events
const events = writable<Map<string, Event>>(new Map());

// Store for RSVPs
const rsvps = writable<Map<string, RSVP[]>>(new Map());

// Generate a random URL-friendly ID
function generateEventId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Convert database event to app event
function convertDatabaseEvent(dbEvent: DatabaseEvent): Event {
	return {
		id: dbEvent.id,
		name: dbEvent.name,
		date: dbEvent.date,
		time: dbEvent.time,
		location: dbEvent.location,
		type: dbEvent.type,
		attendee_limit: dbEvent.attendee_limit,
		visibility: dbEvent.visibility,
		user_id: dbEvent.user_id,
		created_at: dbEvent.created_at,
		updated_at: dbEvent.updated_at
	};
}

// Convert database RSVP to app RSVP
function convertDatabaseRSVP(dbRSVP: DatabaseRSVP): RSVP {
	return {
		id: dbRSVP.id,
		event_id: dbRSVP.event_id,
		name: dbRSVP.name,
		user_id: dbRSVP.user_id,
		created_at: dbRSVP.created_at
	};
}

export const eventsStore = {
	subscribe: events.subscribe,
	subscribeRSVPs: rsvps.subscribe,

	// Create a new event
	createEvent: async (eventData: CreateEventData, userId: string): Promise<string> => {
		const eventId = generateEventId();
		const now = new Date().toISOString();

		try {
			const { error } = await supabase.from('events').insert({
				id: eventId,
				name: eventData.name,
				date: eventData.date,
				time: eventData.time,
				location: eventData.location,
				type: eventData.type,
				attendee_limit: eventData.attendee_limit,
				visibility: eventData.visibility,
				user_id: userId,
				created_at: now,
				updated_at: now
			});

			if (error) throw error;

			// Add to local store
			const newEvent: Event = {
				id: eventId,
				...eventData,
				user_id: userId,
				created_at: now,
				updated_at: now
			};

			events.update((currentEvents) => {
				const newMap = new Map(currentEvents);
				newMap.set(eventId, newEvent);
				return newMap;
			});

			// Initialize empty RSVP list
			rsvps.update((currentRSVPs) => {
				const newMap = new Map(currentRSVPs);
				newMap.set(eventId, []);
				return newMap;
			});

			return eventId;
		} catch (error) {
			console.error('Error creating event:', error);
			throw error;
		}
	},

	// Get event by ID
	getEvent: async (id: string): Promise<Event | undefined> => {
		try {
			const { data, error } = await supabase.from('events').select('*').eq('id', id).single();

			if (error) throw error;

			if (data) {
				const event = convertDatabaseEvent(data);

				// Update local store
				events.update((currentEvents) => {
					const newMap = new Map(currentEvents);
					newMap.set(id, event);
					return newMap;
				});

				return event;
			}

			return undefined;
		} catch (error) {
			console.error('Error fetching event:', error);
			return undefined;
		}
	},

	// Get RSVPs for an event
	getRSVPs: async (eventId: string): Promise<RSVP[]> => {
		try {
			const { data, error } = await supabase
				.from('rsvps')
				.select('*')
				.eq('event_id', eventId)
				.order('created_at', { ascending: true });

			if (error) throw error;

			const rsvpList = data?.map(convertDatabaseRSVP) || [];

			// Update local store
			rsvps.update((currentRSVPs) => {
				const newMap = new Map(currentRSVPs);
				newMap.set(eventId, rsvpList);
				return newMap;
			});

			return rsvpList;
		} catch (error) {
			console.error('Error fetching RSVPs:', error);
			return [];
		}
	},

	// Add RSVP to an event
	addRSVP: async (eventId: string, name: string, userId: string): Promise<boolean> => {
		try {
			// First check if event exists and get its details
			const event = await eventsStore.getEvent(eventId);
			if (!event) return false;

			// Check if event is full (for limited type events)
			if (event.type === 'limited' && event.attendee_limit) {
				const currentRSVPs = await eventsStore.getRSVPs(eventId);
				if (currentRSVPs.length >= event.attendee_limit) {
					return false; // Event is full
				}
			}

			// Check if name is already in the list
			const existingRSVPs = await eventsStore.getRSVPs(eventId);
			if (existingRSVPs.some((rsvp) => rsvp.name.toLowerCase() === name.toLowerCase())) {
				return false; // Name already exists
			}

			// Add RSVP to database
			const { data, error } = await supabase
				.from('rsvps')
				.insert({
					event_id: eventId,
					name: name.trim(),
					user_id: userId,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) throw error;

			// Update local store
			const newRSVP = convertDatabaseRSVP(data);
			rsvps.update((currentRSVPs) => {
				const newMap = new Map(currentRSVPs);
				const eventRSVPs = newMap.get(eventId) || [];
				newMap.set(eventId, [...eventRSVPs, newRSVP]);
				return newMap;
			});

			return true;
		} catch (error) {
			console.error('Error adding RSVP:', error);
			return false;
		}
	},

	// Remove RSVP from an event
	removeRSVP: async (eventId: string, rsvpId: string): Promise<boolean> => {
		try {
			const { error } = await supabase
				.from('rsvps')
				.delete()
				.eq('id', rsvpId)
				.eq('event_id', eventId);

			if (error) throw error;

			// Update local store
			rsvps.update((currentRSVPs) => {
				const newMap = new Map(currentRSVPs);
				const eventRSVPs = newMap.get(eventId) || [];
				const updatedRSVPs = eventRSVPs.filter((rsvp) => rsvp.id !== rsvpId);
				newMap.set(eventId, updatedRSVPs);
				return newMap;
			});

			return true;
		} catch (error) {
			console.error('Error removing RSVP:', error);
			return false;
		}
	},

	// Get event with RSVPs
	getEventWithRSVPs: async (
		eventId: string
	): Promise<{ event: Event; rsvps: RSVP[] } | undefined> => {
		try {
			const [event, rsvpList] = await Promise.all([
				eventsStore.getEvent(eventId),
				eventsStore.getRSVPs(eventId)
			]);

			if (!event) return undefined;

			return { event, rsvps: rsvpList };
		} catch (error) {
			console.error('Error fetching event with RSVPs:', error);
			return undefined;
		}
	},

	// Get events by user ID
	getEventsByUser: async (userId: string): Promise<Event[]> => {
		try {
			const { data, error } = await supabase
				.from('events')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (error) throw error;

			const userEvents = data?.map(convertDatabaseEvent) || [];

			// Update local store
			userEvents.forEach((event) => {
				events.update((currentEvents) => {
					const newMap = new Map(currentEvents);
					newMap.set(event.id, event);
					return newMap;
				});
			});

			return userEvents;
		} catch (error) {
			console.error('Error fetching user events:', error);
			return [];
		}
	},

	// Get public events
	getPublicEvents: async (): Promise<Event[]> => {
		try {
			const { data, error } = await supabase
				.from('events')
				.select('*')
				.eq('visibility', 'public')
				.order('created_at', { ascending: false });

			if (error) throw error;

			const publicEvents = data?.map(convertDatabaseEvent) || [];

			// Update local store
			publicEvents.forEach((event) => {
				events.update((currentEvents) => {
					const newMap = new Map(currentEvents);
					newMap.set(event.id, event);
					return newMap;
				});
			});

			return publicEvents;
		} catch (error) {
			console.error('Error fetching public events:', error);
			return [];
		}
	},

	// Delete event (only by the user who created it)
	deleteEvent: async (eventId: string, userId: string): Promise<boolean> => {
		try {
			// First verify the user owns this event
			const event = await eventsStore.getEvent(eventId);
			if (!event || event.user_id !== userId) {
				return false; // User doesn't own this event
			}

			// Delete the event (RSVPs will be deleted automatically due to CASCADE)
			const { error } = await supabase.from('events').delete().eq('id', eventId);

			if (error) throw error;

			// Remove from local store
			events.update((currentEvents) => {
				const newMap = new Map(currentEvents);
				newMap.delete(eventId);
				return newMap;
			});

			// Remove RSVPs from local store
			rsvps.update((currentRSVPs) => {
				const newMap = new Map(currentRSVPs);
				newMap.delete(eventId);
				return newMap;
			});

			return true;
		} catch (error) {
			console.error('Error deleting event:', error);
			return false;
		}
	}
};
