const { query } = require('../config/connection');

class UserProfile {
  constructor(data) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.image_url = data.image_url || null;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  /**
   * Save or update profile image to database
   * If profile exists for user, update it; otherwise insert new one
   */
  async save() {
    try {
      // Check if profile already exists for this user
      const existing = await UserProfile.findByUserId(this.user_id);
      
      if (existing) {
        // Update existing profile
        const sql = `
          UPDATE user_profiles 
          SET image_url = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `;
        const params = [this.image_url, this.user_id];
        await query(sql, params);
        this.id = existing.id;
        this.updated_at = new Date();
      } else {
        // Insert new profile
        const sql = `
          INSERT INTO user_profiles (user_id, image_url)
          VALUES (?, ?)
        `;
        const params = [this.user_id, this.image_url];
        const result = await query(sql, params);
        this.id = result.insertId;
      }
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find profile image by user_id (returns single profile or null)
   */
  static async findByUserId(userId) {
    try {
      const sql = `
        SELECT * FROM user_profiles 
        WHERE user_id = ? 
        LIMIT 1
      `;
      const results = await query(sql, [userId]);
      if (results.length > 0) {
        return new UserProfile(results[0]);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete profile image by user_id
   */
  static async deleteByUserId(userId) {
    try {
      const sql = 'DELETE FROM user_profiles WHERE user_id = ?';
      const result = await query(sql, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create or update a profile image (static helper)
   */
  static async create(userId, imageUrl) {
    const profile = new UserProfile({
      user_id: userId,
      image_url: imageUrl
    });
    return await profile.save();
  }
}

module.exports = UserProfile;
