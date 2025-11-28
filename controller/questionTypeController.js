const asyncHandler = require('express-async-handler');
const QuestionType = require('../model/QuestionType');
const QuestionAnswer = require('../model/QuestionAnswer');

/**
 * @desc    Add/Create a new question type
 * @route   POST /api/question-types
 * @access  Private (or Public - adjust based on your needs)
 */
const addQuestionType = asyncHandler(async (req, res) => {
  try {
    const { type_name, icon } = req.body;

    // Validation
    if (!type_name || !type_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Type name is required'
      });
    }

    if (!icon || !icon.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Icon is required'
      });
    }

    // Check if question type with same name already exists
    const existingType = await QuestionType.findByTypeName(type_name.trim());
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Question type with this name already exists'
      });
    }

    // Create new question type
    const questionType = await QuestionType.create(
      type_name.trim(),
      icon.trim()
    );

    res.status(201).json({
      success: true,
      message: 'Question type created successfully',
      data: {
        questionType: {
          id: questionType.id,
          type_name: questionType.type_name,
          icon: questionType.icon,
          created_at: questionType.created_at,
          updated_at: questionType.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Add question type error:', error);
    res.status(500).json({
      success: false,
      message: `Error creating question type: ${error.message}`
    });
  }
});

/**
 * @desc    Get all question types with question count
 * @route   GET /api/question-types
 * @access  Public
 */
const getAllQuestionTypes = asyncHandler(async (req, res) => {
  try {
    const questionTypes = await QuestionType.findAll();

    // Get question count for each type
    const questionTypesWithCount = await Promise.all(
      questionTypes.map(async (qt) => {
        const questionCount = await QuestionAnswer.countByTypeId(qt.id);
        return {
          id: qt.id,
          type_name: qt.type_name,
          icon: qt.icon,
          question_count: questionCount,
          created_at: qt.created_at,
          updated_at: qt.updated_at
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Question types retrieved successfully',
      data: {
        questionTypes: questionTypesWithCount
      }
    });
  } catch (error) {
    console.error('Get question types error:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving question types: ${error.message}`
    });
  }
});

/**
 * @desc    Get question type by ID
 * @route   GET /api/question-types/:id
 * @access  Public
 */
const getQuestionTypeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const questionType = await QuestionType.findById(id);

    if (!questionType) {
      return res.status(404).json({
        success: false,
        message: 'Question type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question type retrieved successfully',
      data: {
        questionType: {
          id: questionType.id,
          type_name: questionType.type_name,
          icon: questionType.icon,
          created_at: questionType.created_at,
          updated_at: questionType.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Get question type error:', error);
    res.status(500).json({
      success: false,
      message: `Error retrieving question type: ${error.message}`
    });
  }
});

/**
 * @desc    Update question type
 * @route   PUT /api/question-types/:id
 * @access  Private
 */
const updateQuestionType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { type_name, icon } = req.body;

    // Find existing question type
    const questionType = await QuestionType.findById(id);
    if (!questionType) {
      return res.status(404).json({
        success: false,
        message: 'Question type not found'
      });
    }

    // Validation
    if (type_name !== undefined && !type_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Type name cannot be empty'
      });
    }

    if (icon !== undefined && !icon.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Icon cannot be empty'
      });
    }

    // Check if type name already exists (if changed)
    if (type_name && type_name.trim() !== questionType.type_name) {
      const existingType = await QuestionType.findByTypeName(type_name.trim());
      if (existingType) {
        return res.status(400).json({
          success: false,
          message: 'Question type with this name already exists'
        });
      }
    }

    // Update question type
    questionType.type_name = type_name !== undefined ? type_name.trim() : questionType.type_name;
    questionType.icon = icon !== undefined ? icon.trim() : questionType.icon;
    await questionType.update();

    res.status(200).json({
      success: true,
      message: 'Question type updated successfully',
      data: {
        questionType: {
          id: questionType.id,
          type_name: questionType.type_name,
          icon: questionType.icon,
          created_at: questionType.created_at,
          updated_at: questionType.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Update question type error:', error);
    res.status(500).json({
      success: false,
      message: `Error updating question type: ${error.message}`
    });
  }
});

/**
 * @desc    Delete question type
 * @route   DELETE /api/question-types/:id
 * @access  Private
 */
const deleteQuestionType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if question type exists
    const questionType = await QuestionType.findById(id);
    if (!questionType) {
      return res.status(404).json({
        success: false,
        message: 'Question type not found'
      });
    }

    // Delete question type (this will cascade delete related questions if foreign key is set)
    const deleted = await QuestionType.delete(id);

    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Question type deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete question type'
      });
    }
  } catch (error) {
    console.error('Delete question type error:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting question type: ${error.message}`
    });
  }
});

module.exports = {
  addQuestionType,
  getAllQuestionTypes,
  getQuestionTypeById,
  updateQuestionType,
  deleteQuestionType
};

