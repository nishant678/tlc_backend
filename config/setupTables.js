const { query, testConnection } = require('./connection');

/**
 * Create users table
 */
async function createUsersTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobile_number VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_mobile (mobile_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Users table created successfully');
  } catch (error) {
    console.error('❌ Error creating users table:', error.message);
    throw error;
  }
}

/**
 * Create user_profiles table for single profile image per user
 * Note: To enforce one image per user, add UNIQUE constraint on user_id:
 * ALTER TABLE user_profiles ADD UNIQUE KEY unique_user_id (user_id);
 */
async function createUserProfilesTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        image_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ User profiles table created successfully');
  } catch (error) {
    console.error('❌ Error creating user_profiles table:', error.message);
    throw error;
  }
}

/**
 * Run all setup functions
 */
async function setupTables() {
  try {
    console.log('🔄 Starting database setup...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Create tables
    await createUsersTable();
    await createUserProfilesTable();

    console.log('✅ All tables setup completed successfully');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    throw error;
  }
}

module.exports = {
  createUsersTable,
  createUserProfilesTable,
  setupTables
};

