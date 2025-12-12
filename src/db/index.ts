import { Pool } from "pg";
import config from "../config";
const pool = new Pool({
  connectionString: config.database_url,
});
  const initDB = async () => {
  // Users
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CHECK(email = LOWER(email)),
        password TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    // Vehicles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(100) NOT NULL,
          type VARCHAR(20) NOT NULL,
          registration_number VARCHAR(100) NOT NULL UNIQUE,
          daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price >= 0),
          availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      )`);

    // Bookings
    await pool.query(`
          CREATE TABLE IF NOT EXISTS bookings(
              id SERIAL PRIMARY KEY,
              customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
              rent_start_date DATE NOT NULL,
              rent_end_date DATE NOT NULL CHECK (rent_start_date < rent_end_date),
              total_price NUMERIC NOT NULL CHECK (total_price >= 0),
              status VARCHAR(20) NOT NULL,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
          )`);
};

export default {
  initDB,
  pool: pool,
};
