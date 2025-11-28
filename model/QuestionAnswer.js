const { query } = require('../config/connection');

class QuestionAnswer {
  constructor(data) {
    this.id = data.id || null;
    this.type_id = data.type_id || null;
    this.question = data.question || null;
    this.option1 = data.option1 || null;
    this.option2 = data.option2 || null;
    this.option3 = data.option3 || null;
    this.option4 = data.option4 || null;
    this.correct_answer = data.correct_answer || null; // 1, 2, 3, or 4
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  /**
   * Save question answer to database
   */
  async save() {
    try {
      const sql = `
        INSERT INTO question_answers (type_id, question, option1, option2, option3, option4, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        this.type_id,
        this.question,
        this.option1,
        this.option2,
        this.option3,
        this.option4,
        this.correct_answer
      ];
      const result = await query(sql, params);
      this.id = result.insertId;
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find question answer by ID
   */
  static async findById(id) {
    try {
      const sql = 'SELECT * FROM question_answers WHERE id = ?';
      const results = await query(sql, [id]);
      if (results.length > 0) {
        return new QuestionAnswer(results[0]);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all question answers by type_id
   */
  static async findByTypeId(typeId) {
    try {
      const sql = `
        SELECT * FROM question_answers 
        WHERE type_id = ? 
        ORDER BY created_at DESC
      `;
      const results = await query(sql, [typeId]);
      return results.map(qa => new QuestionAnswer(qa));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all question answers
   */
  static async findAll() {
    try {
      const sql = 'SELECT * FROM question_answers ORDER BY created_at DESC';
      const results = await query(sql);
      return results.map(qa => new QuestionAnswer(qa));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count questions by type_id
   */
  static async countByTypeId(typeId) {
    try {
      const sql = 'SELECT COUNT(*) as count FROM question_answers WHERE type_id = ?';
      const results = await query(sql, [typeId]);
      return results[0]?.count || 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update question answer
   */
  async update() {
    try {
      const sql = `
        UPDATE question_answers 
        SET type_id = ?, question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, 
            correct_answer = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const params = [
        this.type_id,
        this.question,
        this.option1,
        this.option2,
        this.option3,
        this.option4,
        this.correct_answer,
        this.id
      ];
      await query(sql, params);
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete question answer
   */
  static async delete(id) {
    try {
      const sql = 'DELETE FROM question_answers WHERE id = ?';
      const result = await query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new question answer (static helper)
   */
  static async create(typeId, question, option1, option2, option3, option4, correctAnswer) {
    const questionAnswer = new QuestionAnswer({
      type_id: typeId,
      question: question,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
      correct_answer: correctAnswer
    });
    return await questionAnswer.save();
  }
}

module.exports = QuestionAnswer;

