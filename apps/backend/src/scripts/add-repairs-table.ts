import { pool, query } from '../models/db.js';

const migrate = async () => {
  console.log('Adding repairs table...');

  try {
    // Create repairs table
    await query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID NOT NULL REFERENCES vehicles(id),
        customer_id UUID NOT NULL REFERENCES customers(id),
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        cost DECIMAL(12, 2),
        start_date DATE NOT NULL,
        end_date DATE,
        technician VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES users(id)
      );
    `);
    console.log('✓ Created repairs table');

    // Create indexes for repairs
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_vehicle_id ON repairs(vehicle_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_customer_id ON repairs(customer_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_start_date ON repairs(start_date);');
    console.log('✓ Created repairs indexes');

    // Add update_updated_at trigger to repairs table
    await query(`
      DROP TRIGGER IF EXISTS update_repairs_updated_at ON repairs;
      CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✓ Created trigger for repairs table');

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
