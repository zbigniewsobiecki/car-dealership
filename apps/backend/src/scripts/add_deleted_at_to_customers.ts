import { pool, query } from '../models/db.js';

const migrate = async () => {
  console.log('Adding deleted_at column to customers table...');

  try {
    await query(`
      ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✓ Added deleted_at column');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at);
    `);
    console.log('✓ Created index on deleted_at');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

const runMigration = async () => {
  try {
    await migrate();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

runMigration();