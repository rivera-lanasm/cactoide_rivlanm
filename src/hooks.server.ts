import { env } from '$env/dynamic/private';

export const handle = async ({ event, resolve }) => {
	// Check if analytics is enabled
	const analyticsEnabled = env.ANALYTICS === 'true';

	// Define the analytics script HTML
	const analyticsScript = analyticsEnabled
		? '<script defer src="https://analytics.dalev.hu/script.js" data-website-id="7425d098-e340-4464-bd03-c2e47b004cd9"></script>'
		: '';

	// Replace the placeholder with the actual script or empty string
	const response = await resolve(event);

	if (response.headers.get('content-type')?.includes('text/html')) {
		const html = await response.text();
		const modifiedHtml = html.replace('%ANALYTICS_SCRIPT%', analyticsScript);

		return new Response(modifiedHtml, {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText
		});
	}

	return response;
};
