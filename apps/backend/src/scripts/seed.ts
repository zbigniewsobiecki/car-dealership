import bcrypt from 'bcryptjs';
import { pool, query } from '../models/db.js';

const seedData = async () => {
  console.log('Starting database seeding...');

  try {
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      ['admin@cardealership.com', adminPasswordHash, 'Admin', 'User', 'admin', true]
    );
    const adminId = adminResult.rows[0].id;
    console.log('✓ Created admin user (email: admin@cardealership.com, password: admin123)');

    // Create salesperson user
    const salespersonPasswordHash = await bcrypt.hash('sales123', 10);
    const salespersonResult = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      ['sales@cardealership.com', salespersonPasswordHash, 'John', 'Salesperson', 'salesperson', true]
    );
    const salespersonId = salespersonResult.rows[0].id;
    console.log('✓ Created salesperson user (email: sales@cardealership.com, password: sales123)');

    // Create sample customers
    const customer1Result = await query(
      `INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      ['Michael', 'Johnson', 'michael.johnson@email.com', '555-0101', '123 Main St', 'Springfield', 'IL', '62701', adminId]
    );
    const customer1Id = customer1Result.rows[0].id;

    const customer2Result = await query(
      `INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      ['Sarah', 'Williams', 'sarah.williams@email.com', '555-0102', '456 Oak Ave', 'Springfield', 'IL', '62702', adminId]
    );
    const customer2Id = customer2Result.rows[0].id;

    await query(
      `INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      ['David', 'Brown', 'david.brown@email.com', '555-0103', '789 Pine Rd', 'Springfield', 'IL', '62703', adminId]
    );
    console.log('✓ Created 3 sample customers');

    // Create sample vehicles
    const vehicle1Result = await query(
      `INSERT INTO vehicles (vin, make, model, year, color, mileage, price, cost, status, condition, body_type, transmission, fuel_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      ['1HGCM82633A123456', 'Honda', 'Accord', 2023, 'Silver', 15000, 28500.00, 25000.00, 'available', 'used', 'Sedan', 'Automatic', 'Gasoline', adminId]
    );
    const vehicle1Id = vehicle1Result.rows[0].id;

    const vehicle2Result = await query(
      `INSERT INTO vehicles (vin, make, model, year, color, mileage, price, cost, status, condition, body_type, transmission, fuel_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      ['2T1BURHE9JC123789', 'Toyota', 'Camry', 2024, 'Blue', 5000, 32000.00, 28500.00, 'available', 'certified_pre_owned', 'Sedan', 'Automatic', 'Hybrid', adminId]
    );
    const vehicle2Id = vehicle2Result.rows[0].id;

    await query(
      `INSERT INTO vehicles (vin, make, model, year, color, mileage, price, cost, status, condition, body_type, transmission, fuel_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      ['1FTFW1EF5DFC12345', 'Ford', 'F-150', 2022, 'Black', 25000, 42000.00, 38000.00, 'available', 'used', 'Truck', 'Automatic', 'Gasoline', adminId]
    );

    await query(
      `INSERT INTO vehicles (vin, make, model, year, color, mileage, price, cost, status, condition, body_type, transmission, fuel_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      ['3VWCX7AJ8EM123456', 'Volkswagen', 'Jetta', 2025, 'White', 0, 26000.00, 22000.00, 'available', 'new', 'Sedan', 'Automatic', 'Gasoline', adminId]
    );

    await query(
      `INSERT INTO vehicles (vin, make, model, year, color, mileage, price, cost, status, condition, body_type, transmission, fuel_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      ['5YJSA1E28JF123456', 'Tesla', 'Model 3', 2023, 'Red', 12000, 45000.00, 40000.00, 'reserved', 'used', 'Sedan', 'Automatic', 'Electric', adminId]
    );
    console.log('✓ Created 5 sample vehicles');

    // Create a sample sale
    await query(
      `INSERT INTO sales (vehicle_id, customer_id, salesperson_id, sale_price, sale_date, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [vehicle1Id, customer1Id, salespersonId, 28000.00, '2024-01-15', 'Financing', 'completed']
    );

    // Update vehicle status to sold
    await query('UPDATE vehicles SET status = $1 WHERE id = $2', ['sold', vehicle1Id]);
    console.log('✓ Created 1 sample sale');

    // Create a pending sale
    await query(
      `INSERT INTO sales (vehicle_id, customer_id, salesperson_id, sale_price, sale_date, payment_method, status, down_payment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [vehicle2Id, customer2Id, salespersonId, 31500.00, '2024-01-20', 'Financing', 'pending', 5000.00]
    );
    console.log('✓ Created 1 pending sale');

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('   Admin: admin@cardealership.com / admin123');
    console.log('   Salesperson: sales@cardealership.com / sales123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    await seedData();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

runSeed();
