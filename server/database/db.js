import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde el archivo .env

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
