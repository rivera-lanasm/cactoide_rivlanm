import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import postgres from 'postgres';

// Database connection configuration
const connectionConfig = {
	max: 10, // Maximum number of connections
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10 // Connection timeout in seconds
};

const client = postgres(env.DATABASE_URL, connectionConfig);

export const database = drizzle(client, { schema });
