/**
 * Calendar integration utilities for iCal generation and calendar service links
 */

export interface CalendarEvent {
	name: string;
	date: string;
	time: string;
	location: string;
	description?: string;
	url?: string;
}

/**
 * Formats a date and time string for iCal format (UTC)
 */
export const formatDateForICal = (date: string, time: string): string => {
	const eventDate = new Date(`${date}T${time}`);
	return eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Generates iCal content for an event
 */
export const generateICalContent = (event: CalendarEvent, eventId: string): string => {
	const startDate = formatDateForICal(event.date, event.time);
	const endDate = formatDateForICal(event.date, event.time); // You might want to add duration logic here
	const eventUrl = event.url || '';

	return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cactoide//Event Calendar//EN
BEGIN:VEVENT
UID:${eventId}@cactoide.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.name}
DESCRIPTION:${event.description || `Event URL: ${eventUrl}`}
LOCATION:${event.location}
URL:${eventUrl}
END:VEVENT
END:VCALENDAR`;
};

/**
 * Downloads an iCal file for the given event
 */
export const downloadICalFile = (
	event: CalendarEvent,
	eventId: string,
	filename?: string
): void => {
	const icalContent = generateICalContent(event, eventId);
	const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename || `${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

/**
 * Generates Google Calendar URL for adding an event
 */
export const getGoogleCalendarUrl = (
	event: CalendarEvent,
	eventId: string,
	baseUrl: string
): string => {
	const eventUrl = event.url || `${baseUrl}/event/${eventId}`;
	const startDate = formatDateForICal(event.date, event.time);
	const endDate = formatDateForICal(event.date, event.time);

	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || `Event URL: ${eventUrl}`)}&location=${encodeURIComponent(event.location)}`;
};

/**
 * Generates Microsoft Outlook URL for adding an event
 */
export const getOutlookCalendarUrl = (
	event: CalendarEvent,
	eventId: string,
	baseUrl: string
): string => {
	const eventUrl = event.url || `${baseUrl}/event/${eventId}`;
	const startDate = formatDateForICal(event.date, event.time);
	const endDate = formatDateForICal(event.date, event.time);

	return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.name)}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(event.description || `Event URL: ${eventUrl}`)}&location=${encodeURIComponent(event.location)}`;
};

/**
 * Opens Google Calendar in a new tab
 */
export const addToGoogleCalendar = (
	event: CalendarEvent,
	eventId: string,
	baseUrl: string
): void => {
	const url = getGoogleCalendarUrl(event, eventId, baseUrl);
	window.open(url, '_blank');
};

/**
 * Opens Microsoft Outlook in a new tab
 */
export const addToOutlookCalendar = (
	event: CalendarEvent,
	eventId: string,
	baseUrl: string
): void => {
	const url = getOutlookCalendarUrl(event, eventId, baseUrl);
	window.open(url, '_blank');
};
