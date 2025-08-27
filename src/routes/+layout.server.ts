import { generateUserId } from '$lib/generateUserId.js';

export function load({ cookies }) {
	const cactoideUserId = cookies.get('cactoideUserId');
	const userId = generateUserId();

	const DAYS = 400; // practical upper bound in many browsers for cookies
	const MAX_AGE = 60 * 60 * 24 * DAYS;
	const PATH = '/';

	if (!cactoideUserId) {
		console.log(`There is no cactoideUserId cookie, generating new one...`);
		cookies.set('cactoideUserId', userId, { path: PATH, maxAge: MAX_AGE });
	} else {
		console.log(`cactoideUserId: ${cactoideUserId}`);
		console.log(`cactoideUserId cookie found, using existing one...`);
	}

	return {
		cactoideUserId
	};
}
