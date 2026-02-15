import { pool, query } from '../models/db.js';

const createTables = async () => {
  console.log('Starting database migration...');

  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'salesperson')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created users table');

    // Create indexes for users
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);');
    console.log('✓ Created users indexes');

    // Create customers table
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE,
        created_by UUID REFERENCES users(id)
      );
    `);
    console.log('✓ Created customers table');

    // Create indexes for customers
    await query('CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(last_name, first_name);');
    await query('CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at);');
    // Create partial unique index for email (only for active customers)
    await query('CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email_active ON customers(email) WHERE deleted_at IS NULL;');
    console.log('✓ Created customers indexes');

    // Create vehicles table
    await query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vin VARCHAR(17) UNIQUE NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
        color VARCHAR(50),
        mileage INTEGER,
        price DECIMAL(12, 2) NOT NULL,
        cost DECIMAL(12, 2),
        type VARCHAR(50) NOT NULL DEFAULT 'car' CHECK (type IN ('car', 'motorcycle')),
        status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'sold', 'reserved', 'maintenance')),
        condition VARCHAR(50) CHECK (condition IN ('new', 'used', 'certified_pre_owned')),
        body_type VARCHAR(50),
        transmission VARCHAR(50),
        fuel_type VARCHAR(50),
        engine VARCHAR(100),
        drivetrain VARCHAR(50),
        exterior_color VARCHAR(50),
        interior_color VARCHAR(50),
        features JSONB,
        description TEXT,
        images JSONB,
        date_acquired DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES users(id)
      );
    `);
    console.log('✓ Created vehicles table');

    // Create indexes for vehicles
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);');
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);');
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);');
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);');
    await query('CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);');
    console.log('✓ Created vehicles indexes');

    // Create sales table
    await query(`
      CREATE TABLE IF NOT EXISTS sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID NOT NULL REFERENCES vehicles(id),
        customer_id UUID NOT NULL REFERENCES customers(id),
        salesperson_id UUID NOT NULL REFERENCES users(id),
        sale_price DECIMAL(12, 2) NOT NULL,
        sale_date DATE NOT NULL,
        payment_method VARCHAR(50),
        financing_details JSONB,
        trade_in_vehicle VARCHAR(255),
        trade_in_value DECIMAL(12, 2),
        down_payment DECIMAL(12, 2),
        status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created sales table');

    // Create indexes for sales
    await query('CREATE INDEX IF NOT EXISTS idx_sales_vehicle_id ON sales(vehicle_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_sales_salesperson_id ON sales(salesperson_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);');
    await query('CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);');
    console.log('✓ Created sales indexes');

    // Create repairs table
    await query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id UUID NOT NULL REFERENCES vehicles(id),
        customer_id UUID NOT NULL REFERENCES customers(id),
        description TEXT NOT NULL,
        cost DECIMAL(12, 2) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        service_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created repairs table');

    // Create indexes for repairs
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_vehicle_id ON repairs(vehicle_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_customer_id ON repairs(customer_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_repairs_service_date ON repairs(service_date);');
    console.log('✓ Created repairs indexes');

    // Create trigger function for updated_at
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✓ Created update_updated_at_column function');

    // Create triggers for all tables
    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
      CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
      CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
      CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_repairs_updated_at ON repairs;
      CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✓ Created triggers for all tables');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

const runMigration = async () => {
  try {
    await createTables();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

runMigration();
