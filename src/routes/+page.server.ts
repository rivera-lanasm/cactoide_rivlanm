import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_LANDING_INFO } from '$env/static/public';

export const load: PageServerLoad = async () => {
	if (PUBLIC_LANDING_INFO === 'false') {
		throw redirect(302, '/discover');
	}

	return {};
};
