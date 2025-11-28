const { query } = require('../config/connection');

class QuestionType {
  constructor(data) {
    this.id = data.id || null;
    this.type_name = data.type_name || null;
    this.icon = data.icon || null;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  /**
   * Save question type to database
   */
  async save() {
    try {
      const sql = `
        INSERT INTO question_types (type_name, icon)
        VALUES (?, ?)
      `;

      const params = [this.type_name, this.icon];
      const result = await query(sql, params);
      this.id = result.insertId;
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find question type by ID
   */
  static async findById(id) {
    try {
      const sql = 'SELECT * FROM question_types WHERE id = ?';
      const results = await query(sql, [id]);
      if (results.length > 0) {
        return new QuestionType(results[0]);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all question types
   */
  static async findAll() {
    try {
      const sql = 'SELECT * FROM question_types ORDER BY created_at DESC';
      const results = await query(sql);
      return results.map(questionType => new QuestionType(questionType));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find question type by type name
   */
  static async findByTypeName(typeName) {
    try {
      const sql = 'SELECT * FROM question_types WHERE type_name = ?';
      const results = await query(sql, [typeName]);
      if (results.length > 0) {
        return new QuestionType(results[0]);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update question type
   */
  async update() {
    try {
      const sql = `
        UPDATE question_types 
        SET type_name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const params = [this.type_name, this.icon, this.id];
      await query(sql, params);
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete question type
   */
  static async delete(id) {
    try {
      const sql = 'DELETE FROM question_types WHERE id = ?';
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new question type (static helper)
   */
  static async create(typeName, icon) {
    const questionType = new QuestionType({
      type_name: typeName,
      icon: icon
    });
    return await questionType.save();
  }
}

module.exports = QuestionType;

