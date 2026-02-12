import { pool, query } from '../models/db.js';

const migrate = async () => {
  console.log('Starting migration: Add soft delete to customers...');

  try {
    // Add deleted_at column
    await query(`
      ALTER TABLE customers 
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✓ Added deleted_at column to customers table');

    // Create index for deleted_at
    await query(`
      CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at);
    `);
    console.log('✓ Created index on customers(deleted_at)');

    // Handle unique email constraint: 
    // If there's an existing unique constraint on email, we should make it partial
    // First, find the constraint name if it exists
    const constraintResult = await query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = 'customers'::regclass 
      AND contype = 'u' 
      AND (
        SELECT array_agg(attname) 
        FROM pg_attribute 
        WHERE attrelid = 'customers'::regclass 
        AND attnum = ANY(conkey)
      ) @> ARRAY['email']::name[];
    `);

    if (constraintResult.rows.length > 0) {
      const constraintName = constraintResult.rows[0].conname;
      await query(`ALTER TABLE customers DROP CONSTRAINT ${constraintName};`);
      console.log(`✓ Dropped existing unique constraint: ${constraintName}`);
    }

    // Drop existing index if it's not partial
    await query('DROP INDEX IF EXISTS idx_customers_email;');

    // Handle duplicate emails before creating unique index
    // We'll keep the most recently updated record and soft-delete the others
    const duplicatesResult = await query(`
      SELECT email, COUNT(*) 
      FROM customers 
      WHERE deleted_at IS NULL 
      GROUP BY email 
      HAVING COUNT(*) > 1;
    `);

    if (duplicatesResult.rows.length > 0) {
      console.log(`Found ${duplicatesResult.rows.length} duplicate email(s). Resolving...`);
      
      for (const row of duplicatesResult.rows) {
        const email = row.email;
        // Keep the most recently updated one, soft delete others
        await query(`
          UPDATE customers 
          SET deleted_at = CURRENT_TIMESTAMP 
          WHERE email = $1 
          AND id NOT IN (
            SELECT id 
            FROM customers 
            WHERE email = $1 
            ORDER BY updated_at DESC 
            LIMIT 1
          );
        `, [email]);
      }
      console.log('✓ Resolved duplicate emails by soft-deleting older records');
    }
    
    // Create partial unique index for email
    await query(`
      CREATE UNIQUE INDEX idx_customers_email_active 
      ON customers(email) 
      WHERE deleted_at IS NULL;
    `);
    console.log('✓ Created partial unique index on customers(email) WHERE deleted_at IS NULL');

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