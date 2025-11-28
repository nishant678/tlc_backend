const mysql = require('mysql2/promise');
const dbConfig = require('./database');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  connectionLimit: dbConfig.connectionLimit,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds timeout
  acquireTimeout: 10000, // 10 seconds to get connection from pool
  timeout: 10000 // 10 seconds query timeout
});

// Test the connection
async function testConnection() {
  try {
    console.log(`Attempting to connect to database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}...`);
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📍 Database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error code:', error.code || 'UNKNOWN');
    console.error('Error message:', error.message || error.toString());
    console.error('Full error:', error);
    console.error('\n📋 Connection Configuration:');
    console.error('   Host:', dbConfig.host);
    console.error('   Port:', dbConfig.port);
    console.error('   User:', dbConfig.user);
    console.error('   Database:', dbConfig.database);
    console.error('   Password:', dbConfig.password ? '*** (set)' : '❌ NOT SET');
    console.error('\n💡 Troubleshooting Steps:');
    console.error('   1. Verify database credentials in Render environment variables');
    console.error('   2. Check if database server is running and accessible');
    console.error('   3. Ensure environment variables are set:');
    console.error('      - DB_HOST (e.g., your-db-host.com)');
    console.error('      - DB_USER (e.g., your-username)');
    console.error('      - DB_PASSWORD (e.g., your-password)');
    console.error('      - DB_NAME (e.g., tlc_db)');
    console.error('      - DB_PORT (e.g., 3306 for MySQL, 5432 for PostgreSQL)');
    console.error('   4. Check firewall/network settings if using external database');
    console.error('   5. Verify database exists and user has proper permissions');
    return false;
  }
}

// Execute a query
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

// Get a connection from the pool
async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Failed to get database connection:', error.message);
    throw error;
  }
}

// Close the pool
async function closePool() {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  getConnection,
  testConnection,
  closePool
};

