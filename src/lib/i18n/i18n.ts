import messages from './messages.json';

// Simple i18n utility for English-only text management
// Get message by key with optional interpolation
export function t(key: string, params?: Record<string, string | number>): string {
	// Navigate through nested keys (e.g., 'common.cancel')
	const keys = key.split('.');
	let value: unknown = messages;

	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = (value as Record<string, unknown>)[k];
		} else {
			console.warn(`Translation key not found: ${key}`);
			return key;
		}
	}

	if (typeof value !== 'string') {
		console.warn(`Translation value is not a string: ${key}`);
		return key;
	}

	// Interpolate parameters
	if (params) {
		return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
			return params[paramKey]?.toString() || match;
		});
	}

	return value;
}

// Format plural forms (basic implementation)
export function tp(key: string, count: number, params?: Record<string, string | number>): string {
	const baseKey = key;
	const pluralKey = `${key}_plural`;

	// Try to get plural form first
	let message = t(pluralKey, { ...params, count });

	// If plural form doesn't exist, use singular
	if (message === pluralKey) {
		message = t(baseKey, { ...params, count });
	}

	// Replace {plural} with 's' if count > 1
	if (count !== 1) {
		message = message.replace('{plural}', 's');
	} else {
		message = message.replace('{plural}', '');
	}

	return message;
}
