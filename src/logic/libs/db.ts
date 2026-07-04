import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_SUPABASE_DB_URL || process.env.SUPABASE_DB_URL;

if (!dbUrl) {
    console.warn("WARNING: Supabase DB URL not found.");
}

export const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});
