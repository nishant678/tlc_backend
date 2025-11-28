const asyncHandler = require('express-async-handler');
const QuestionAnswer = require('../model/QuestionAnswer');
const QuestionType = require('../model/QuestionType');

/**
 * @desc    Add/Create a new question answer
 * @route   POST /api/question-answers
 * @access  Private
 */
const addQuestionAnswer = asyncHandler(async (req, res) => {
  try {
    const { type_id, question, option1, option2, option3, option4, correct_answer } = req.body;

    // Validation
    if (!type_id) {
      return res.status(400).json({
        success: false,
        message: 'Type ID is required'
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (!option1 || !option1.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Option 1 is required'
      });
    }

    if (!option2 || !option2.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Option 2 is required'
      });
    }

    if (!option3 || !option3.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Option 3 is required'
      });
    }

    if (!option4 || !option4.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Option 4 is required'
      });
    }

    if (!correct_answer || ![1, 2, 3, 4].includes(parseInt(correct_answer))) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer must be 1, 2, 3, or 4'
      });
    }

    // Verify question type exists
    const questionType = await QuestionType.findById(type_id);
    if (!questionType) {
      return res.status(404).json({
        success: false,
        message: 'Question type not found'
      });
    }

    // Create new question answer
    const questionAnswer = await QuestionAnswer.create(
      type_id,
      question.trim(),
      option1.trim(),
      option2.trim(),
      option3.trim(),
      option4.trim(),
      parseInt(correct_answer)
    );

    res.status(201).json({
      success: true,
      message: 'Question answer created successfully',
      data: {
        questionAnswer: {
          id: questionAnswer.id,
          type_id: questionAnswer.type_id,
          question: questionAnswer.question,
          option1: questionAnswer.option1,
          option2: questionAnswer.option2,
          option3: questionAnswer.option3,
          option4: questionAnswer.option4,
          correct_answer: questionAnswer.correct_answer,
          created_at: questionAnswer.created_at,
          updated_at: questionAnswer.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Add question answer error:', error);
    res.status(500).json({
      success: false,
      message: `Error creating question answer: ${error.message}`
    });
  }
});

/**
 * @desc    Get question answers by type_id
 * @route   GET /api/question-answers/type/:typeId
 * @access  Public
 */
const getQuestionAnswersByType = asyncHandler(async (req, res) => {
  try {
    const { typeId } = req.params;

    // Verify question type exists
    const questionType = await QuestionType.findById(typeId);
    if (!questionType) {
      return res.status(404).json({
        success: false,
        message: 'Question type not found'
      });
    }

    // Get all question answers for this type
    const questionAnswers = await QuestionAnswer.findByTypeId(typeId);

    res.status(200).json({
      success: true,
      message: 'Question answers retrieved successfully',
      data: {
        questionAnswers: questionAnswers.map(qa => ({
          id: qa.id,
          type_id: qa.type_id,
          question: qa.question,
          option1: qa.option1,
          option2: qa.option2,
          option3: qa.option3,
          option4: qa.option4,
          correct_answer: qa.correct_answer,
          created_at: qa.created_at,
          updated_at: qa.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Get question answers error:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving question answers: ${error.message}`
    });
  }
});

/**
 * @desc    Update question answer
 * @route   PUT /api/question-answers/:id
 * @access  Private
 */
const updateQuestionAnswer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { type_id, question, option1, option2, option3, option4, correct_answer } = req.body;

    // Find existing question answer
    const questionAnswer = await QuestionAnswer.findById(id);
    if (!questionAnswer) {
      return res.status(404).json({
        success: false,
        message: 'Question answer not found'
      });
    }

    // Validation
    if (type_id !== undefined) {
      const questionType = await QuestionType.findById(type_id);
      if (!questionType) {
        return res.status(404).json({
          success: false,
          message: 'Question type not found'
        });
      }
    }

    if (correct_answer !== undefined && ![1, 2, 3, 4].includes(parseInt(correct_answer))) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer must be 1, 2, 3, or 4'
      });
    }

    // Update question answer
    questionAnswer.type_id = type_id !== undefined ? type_id : questionAnswer.type_id;
    questionAnswer.question = question !== undefined ? question.trim() : questionAnswer.question;
    questionAnswer.option1 = option1 !== undefined ? option1.trim() : questionAnswer.option1;
    questionAnswer.option2 = option2 !== undefined ? option2.trim() : questionAnswer.option2;
    questionAnswer.option3 = option3 !== undefined ? option3.trim() : questionAnswer.option3;
    questionAnswer.option4 = option4 !== undefined ? option4.trim() : questionAnswer.option4;
    questionAnswer.correct_answer = correct_answer !== undefined ? parseInt(correct_answer) : questionAnswer.correct_answer;

    await questionAnswer.update();

    res.status(200).json({
      success: true,
      message: 'Question answer updated successfully',
      data: {
        questionAnswer: {
          id: questionAnswer.id,
          type_id: questionAnswer.type_id,
          question: questionAnswer.question,
          option1: questionAnswer.option1,
          option2: questionAnswer.option2,
          option3: questionAnswer.option3,
          option4: questionAnswer.option4,
          correct_answer: questionAnswer.correct_answer,
          created_at: questionAnswer.created_at,
          updated_at: questionAnswer.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Update question answer error:', error);
    res.status(500).json({
      success: false,
      message: `Error updating question answer: ${error.message}`
    });
  }
});

/**
 * @desc    Delete question answer
 * @route   DELETE /api/question-answers/:id
 * @access  Private
 */
const deleteQuestionAnswer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if question answer exists
    const questionAnswer = await QuestionAnswer.findById(id);
    if (!questionAnswer) {
      return res.status(404).json({
        success: false,
        message: 'Question answer not found'
      });
    }

    // Delete question answer
    const deleted = await QuestionAnswer.delete(id);

    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Question answer deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete question answer'
      });
    }
  } catch (error) {
    console.error('Delete question answer error:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting question answer: ${error.message}`
    });
  }
});

module.exports = {
  addQuestionAnswer,
  getQuestionAnswersByType,
  updateQuestionAnswer,
  deleteQuestionAnswer
};

