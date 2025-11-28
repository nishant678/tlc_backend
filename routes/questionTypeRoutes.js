const express = require('express');
const router = express.Router();
const {
  addQuestionType,
  getAllQuestionTypes,
  getQuestionTypeById,
  updateQuestionType,
  deleteQuestionType
} = require('../controller/questionTypeController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllQuestionTypes);
router.get('/:id', getQuestionTypeById);

// Protected routes (require authentication)
router.post('/', authMiddleware, addQuestionType);
router.put('/:id', authMiddleware, updateQuestionType);
router.delete('/:id', authMiddleware, deleteQuestionType);

module.exports = router;

