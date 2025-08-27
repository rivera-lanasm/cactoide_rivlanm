import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import postgres from 'postgres';

const client = postgres(env.DATABASE_URL, {});

export const drizzleQuery = drizzle(client, { schema });
