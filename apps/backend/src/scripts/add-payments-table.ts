import { pool, query } from '../models/db.js';

const migrate = async () => {
  console.log('Adding payments table...');

  try {
    // Create payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
        stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
        payment_method_types TEXT[] DEFAULT ARRAY['card'],
        client_secret TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created payments table');

    // Create indexes for payments
    await query('CREATE INDEX IF NOT EXISTS idx_payments_repair_id ON payments(repair_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);');
    console.log('✓ Created payments indexes');

    // Add update_updated_at trigger to payments table
    await query(`
      DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
      CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✓ Created trigger for payments table');

    // Add payment_id column to repairs table (optional, for easy reference)
    await query(`
      ALTER TABLE repairs
      ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;
    `);
    console.log('✓ Added payment_id to repairs table');

    await query('CREATE INDEX IF NOT EXISTS idx_repairs_payment_id ON repairs(payment_id);');
    console.log('✓ Created index for repairs.payment_id');

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
