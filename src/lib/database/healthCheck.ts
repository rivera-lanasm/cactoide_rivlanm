import postgres from 'postgres';
import { env } from '$env/dynamic/private';

interface HealthCheckOptions {
	maxRetries?: number;
	baseDelay?: number;
	maxDelay?: number;
	timeout?: number;
}

interface HealthCheckResult {
	success: boolean;
	error?: string;
	attempts: number;
	duration?: number;
}

/**
 * Performs a database health check with retry logic and exponential backoff
 */
export async function checkDatabaseHealth(
	options: HealthCheckOptions = {}
): Promise<HealthCheckResult> {
	const {
		maxRetries = 3,
		baseDelay = 1000, // 1 second
		maxDelay = 10000, // 10 seconds
		timeout = 5000 // 5 seconds
	} = options;

	if (!env.DATABASE_URL) {
		console.error('DATABASE_URL environment variable is not set');
		return {
			success: false,
			error: 'DATABASE_URL environment variable is not set',
			attempts: 0
		};
	}

	let lastError: Error | null = null;

	console.log(`Starting database health check (max retries: ${maxRetries})`);

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		console.log(`Attempt ${attempt}/${maxRetries} - Testing database connection`);

		try {
			// Create a new connection for the health check
			const client = postgres(env.DATABASE_URL, {
				max: 1,
				idle_timeout: 20,
				connect_timeout: timeout / 1000, // Convert to seconds
				onnotice: () => {} // Suppress notices
			});

			// Test the connection with a simple query
			await client`SELECT 1 as health_check`;
			await client.end();

			console.log(`Database connection successful on attempt ${attempt}.`);

			return {
				success: true,
				attempts: attempt
			};
		} catch (error) {
			lastError = error as Error;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error(`Connection failed on attempt ${attempt}: ${errorMessage}`);

			// Don't wait after the last attempt
			if (attempt < maxRetries) {
				const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
				console.log(`Waiting ${delay}ms before retry...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	const finalError = lastError?.message || 'Unknown database connection error';

	console.error(`All ${maxRetries} attempts failed. Final error: ${finalError}`);

	return {
		success: false,
		error: finalError,
		attempts: maxRetries
	};
}

/**
 * Runs database health check and exits the process if it fails
 */
export async function ensureDatabaseConnection(options?: HealthCheckOptions): Promise<void> {
	const result = await checkDatabaseHealth(options);

	if (!result.success) {
		console.error('Database connection failed after all retry attempts');
		console.error(`Error: ${result.error}`);
		console.error(`Attempts made: ${result.attempts}`);
		console.error('Exiting application...');
		process.exit(1);
	}
}
