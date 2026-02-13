import { pool, query } from '../models/db.js';

const migrate = async () => {
  console.log('Adding type column to vehicles table...');

  try {
    // Add type column with default 'car' and check constraint
    await query(`
      ALTER TABLE vehicles 
      ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'car' 
      CHECK (type IN ('car', 'motorcycle'));
    `);
    console.log('✓ Added type column to vehicles table');

    // Update existing records to have 'car' as type (though DEFAULT handles it for new columns)
    await query(`
      UPDATE vehicles SET type = 'car' WHERE type IS NULL;
    `);
    
    // Make it NOT NULL after setting defaults
    await query(`
      ALTER TABLE vehicles ALTER COLUMN type SET NOT NULL;
    `);
    console.log('✓ Set type column to NOT NULL');

    // Create index for type
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);');
    console.log('✓ Created index for vehicle type');

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