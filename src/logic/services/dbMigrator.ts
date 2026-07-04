import pkg from 'pg';
const { Client } = pkg;
import { databaseSchema, TableDef } from '../../../database/schema.js';

/**
 * dbMigrator.ts
 * PostgreSQL (Supabase) Idempotent schema sync.
 */
export async function syncDatabase() {
  const dbUrl = process.env.VITE_SUPABASE_DB_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    throw new Error('VITE_SUPABASE_DB_URL or SUPABASE_DB_URL is not configured for backend sync');
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  try {
    await client.query('BEGIN');

    // Ensure the updated_at function exists
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 1. Drop redundant tables
    const dbTablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    `);
    const existingDbTables = dbTablesRes.rows.map(row => row.table_name);
    const allowedTables = databaseSchema.map(t => t.name);

    for (const dbTable of existingDbTables) {
      if (!allowedTables.includes(dbTable) && dbTable !== 'spatial_ref_sys') {
        await client.query(`DROP TABLE IF EXISTS "${dbTable}" CASCADE;`);
        console.log(`Dropped redundant table: ${dbTable}`);
      }
    }

    for (const table of databaseSchema) {
      const tableName = table.name;
      
      // 2. Create table with just ID if it doesn't exist to establish baseline
      const idCol = table.columns.find(c => c.name === 'id');
      const idDef = idCol ? `${idCol.name} ${idCol.type}` : 'id UUID PRIMARY KEY DEFAULT gen_random_uuid()';
      await client.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (${idDef});`);

      // 3. Fetch existing columns
      const res = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1
          AND table_schema = 'public';
      `, [tableName]);
      
      const existingColumns = res.rows.map(row => row.column_name);
      
      // 4. Add missing columns
      for (const col of table.columns) {
        if (col.name !== 'id' && !existingColumns.includes(col.name)) {
          await client.query(`ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.type};`);
        }
      }

      // 5. Drop redundant columns
      const schemaColumnNames = table.columns.map(c => c.name);
      for (const dbCol of existingColumns) {
        if (!schemaColumnNames.includes(dbCol)) {
          await client.query(`ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "${dbCol}" CASCADE;`);
          console.log(`Dropped redundant column: ${dbCol} from table: ${tableName}`);
        }
      }

      // 4. Add foreign keys if any (Simplified: we assume if table is just created, it might need FKs. 
      // But adding FK repeatedly can cause errors if not handled, so we skip dynamic FK dropping/adding here 
      // and just assume they are part of initial table or we execute them if we can guarantee idempotency)
      // For a robust approach, we just try to execute the add constraint and ignore if it exists.
      // Postgres doesn't have ADD CONSTRAINT IF NOT EXISTS, so we catch the error.
      if (table.foreignKeys) {
         for (const fk of table.foreignKeys) {
            try {
               // Extract 'FOREIGN KEY (pin_id) REFERENCES ...'
               // Very simplified handling
               await client.query(`ALTER TABLE "${tableName}" ADD ${fk};`);
            } catch (err: any) {
               // Ignore duplicate constraint errors (42710)
               if (err.code !== '42710' && err.code !== '42830') {
                  console.warn(`Could not add FK for ${tableName}:`, err.message);
               }
            }
         }
      }

      // 5. Audit Trigger
      await client.query(`DROP TRIGGER IF EXISTS "${tableName}_update_audit" ON "${tableName}";`);
      await client.query(`
        CREATE TRIGGER "${tableName}_update_audit"
        BEFORE UPDATE ON "${tableName}"
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
}
