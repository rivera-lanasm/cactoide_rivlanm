// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { generateUserId } from '$lib/generateUserId.js';

export const handle: Handle = async ({ event, resolve }) => {
	const cactoideUserId = event.cookies.get('cactoideUserId');
	const userId = generateUserId();

	const DAYS = 400; // practical upper bound in many browsers for cookies
	const MAX_AGE = 60 * 60 * 24 * DAYS;
	const PATH = '/';

	if (!cactoideUserId) {
		console.debug(`There is no cactoideUserId cookie, generating new one...`);
		event.cookies.set('cactoideUserId', userId, { path: PATH, maxAge: MAX_AGE });
	} else {
		console.debug(`cactoideUserId: ${cactoideUserId}`);
		console.debug(`cactoideUserId cookie found, using existing one...`);
	}

	return resolve(event);
};
