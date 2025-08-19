import { writable } from 'svelte/store';
import type { Event, CreateEventData, RSVP } from '$lib/types';

// In-memory store for events (in a real app, this would be a database)
const events = writable<Map<string, Event>>(new Map());

// Generate a random URL-friendly ID
function generateEventId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Generate a random ID for RSVPs
function generateRSVPId(): string {
	return Math.random().toString(36).substr(2, 9);
}

export const eventsStore = {
	subscribe: events.subscribe,

	createEvent: (eventData: CreateEventData): string => {
		const eventId = generateEventId();
		const newEvent: Event = {
			id: eventId,
			...eventData,
			createdAt: new Date().toISOString(),
			attendees: []
		};

		events.update((currentEvents) => {
			const newMap = new Map(currentEvents);
			newMap.set(eventId, newEvent);
			return newMap;
		});

		return eventId;
	},

	getEvent: (id: string): Event | undefined => {
		let event: Event | undefined;
		events.update((currentEvents) => {
			event = currentEvents.get(id);
			return currentEvents;
		});
		return event;
	},

	addRSVP: (eventId: string, name: string): boolean => {
		let success = false;

		events.update((currentEvents) => {
			const event = currentEvents.get(eventId);
			if (!event) return currentEvents;

			// Check if event is full (for limited type events)
			if (
				event.type === 'limited' &&
				event.attendee_limit &&
				event.attendees.length >= event.attendee_limit
			) {
				return currentEvents;
			}

			// Check if name is already in the list
			if (event.attendees.some((attendee) => attendee.name.toLowerCase() === name.toLowerCase())) {
				return currentEvents;
			}

			const newRSVP: RSVP = {
				id: generateRSVPId(),
				name,
				timestamp: new Date().toISOString()
			};

			const updatedEvent = {
				...event,
				attendees: [...event.attendees, newRSVP]
			};

			const newMap = new Map(currentEvents);
			newMap.set(eventId, updatedEvent);
			success = true;
			return newMap;
		});

		return success;
	},

	removeRSVP: (eventId: string, rsvpId: string): boolean => {
		let success = false;

		events.update((currentEvents) => {
			const event = currentEvents.get(eventId);
			if (!event) return currentEvents;

			const updatedEvent = {
				...event,
				attendees: event.attendees.filter((attendee) => attendee.id !== rsvpId)
			};

			const newMap = new Map(currentEvents);
			newMap.set(eventId, updatedEvent);
			success = true;
			return newMap;
		});

		return success;
	}
};
