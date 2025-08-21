require('dotenv').config();
const knexLib = require('knex');
 
const knex = knexLib({
  client: 'mssql',
  connection: {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
      encrypt: true,
      trustServerCertificate: true,
      instanceName: 'SQL2016STD',
      requestTimeout: 30000
    },
    // estos dos van fuera de options
    connectionTimeout: 30000,
    port: undefined // 👈 si usas instanceName, NO pongas puerto
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 20,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    createTimeoutMillis: parseInt(process.env.DB_CREATE_TIMEOUT) || 30000,
    acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 30000,
    reapIntervalMillis: parseInt(process.env.DB_REAP_INTERVAL) || 1000,
    createRetryIntervalMillis: parseInt(process.env.DB_CREATE_RETRY_INTERVAL) || 200
  },
  useNullAsDefault: true,
  log: {
    warn: message => console.warn('[Knex warn]', message),
    error: message => console.error('[Knex error]', message),
    deprecate: message => console.log('[Knex deprecated]', message),
    debug: message => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Knex debug]', message);
      }
    }
  }
});
 
 
// Probar conexión
(async () => {
  try {
    await knex.raw('SELECT 1 AS result');
    console.log('✅ Conectado a SQL Server con éxito (Knex)');
    console.log(`📊 Base de datos: ${process.env.DB_NAME || 'TpLog'}`);
    console.log(`🖥️  Servidor: ${process.env.DB_HOST || 'TPCCP-DB103.teleperformance.co'}`);
  } catch (error) {
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_NAME);
    console.log(process.env.DB_PORT);
    console.error('❌ Error al conectar a SQL Server:', error.message);
    process.exit(1);
  }
})();
 
module.exports = knex;