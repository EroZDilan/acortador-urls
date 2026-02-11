import { Pool } from 'pg';

// Obtener la URL de conexión
const connectionString = process.env.DATABASE_URL;

console.log('Inicializando Pool de PostgreSQL...');
console.log('DATABASE_URL definida:', !!connectionString);
console.log('DATABASE_URL length:', connectionString?.length);

if (!connectionString) {
  console.error('ERROR: DATABASE_URL no está definida');
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

// Configuración del pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en Pool de PostgreSQL:', err);
});

export default pool;