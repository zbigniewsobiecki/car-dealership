import pool from '../models/db';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Starting migration: add-motorcycle-fields');
    
    await client.query('BEGIN');

    // Add engine_displacement column
    await client.query(`
      ALTER TABLE vehicles 
      ADD COLUMN IF NOT EXISTS engine_displacement DECIMAL(10, 2)
    `);
    console.log('Added engine_displacement column');

    // Add category column
    await client.query(`
      ALTER TABLE vehicles 
      ADD COLUMN IF NOT EXISTS category VARCHAR(50)
    `);
    console.log('Added category column');

    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.log('Migration failed, rolled back');
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();