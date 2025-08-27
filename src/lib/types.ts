export type EventType = 'limited' | 'unlimited';
export type EventVisibility = 'public' | 'private';

export interface Event {
	id: string;
	name: string;
	date: string;
	time: string;
	location: string;
	type: EventType;
	attendee_limit?: number;
	visibility: EventVisibility;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface RSVP {
	id: string;
	event_id: string;
	name: string;
	user_id: string;
	created_at: string;
}

export interface CreateEventData {
	name: string;
	date: string;
	time: string;
	location: string;
	type: EventType;
	attendee_limit?: number;
	visibility: EventVisibility;
}

export interface DatabaseEvent {
	id: string;
	name: string;
	date: string;
	time: string;
	location: string;
	type: EventType;
	attendee_limit?: number;
	visibility: EventVisibility;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface DatabaseRSVP {
	id: string;
	event_id: string;
	name: string;
	user_id: string;
	created_at: string;
}
