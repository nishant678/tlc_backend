const express = require('express');
const router = express.Router();
const {
  addQuestionAnswer,
  getQuestionAnswersByType,
  updateQuestionAnswer,
  deleteQuestionAnswer
} = require('../controller/questionAnswerController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.get('/type/:typeId', getQuestionAnswersByType);

// Protected routes (require authentication)
router.post('/', authMiddleware, addQuestionAnswer);
router.put('/:id', authMiddleware, updateQuestionAnswer);
router.delete('/:id', authMiddleware, deleteQuestionAnswer);

module.exports = router;

