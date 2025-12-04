const QuestionType = require("../model/questionTypeModel");
const asyncHandler = require("express-async-handler");

// -------------------- ADD QuestionType --------------------
const addQuestionType = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ status: false, message: "Name is required" });
    }

    let data = { name };

    if (req.file) {
        data.image = req.file.filename;
    }

    const questionType = await QuestionType.create(data);

    res.status(200).json({
        status: true,
        message: "Question Type added successfully",
        data: questionType
    });
});

// -------------------- GET QuestionType List --------------------
const getQuestionTypeList = asyncHandler(async (req, res) => {
    const list = await QuestionType.find().sort({ createdAt: -1 });

    res.status(200).json({
        status: true,
        message: "Question Type List fetched successfully",
        data: list
    });
});

// -------------------- UPDATE QuestionType --------------------
const updateQuestionType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    let updateData = { name };

    if (req.file) {
        updateData.image = req.file.filename;
    }

    const updated = await QuestionType.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
        status: true,
        message: "Question Type updated successfully",
        data: updated
    });
});

// -------------------- DELETE QuestionType --------------------
const deleteQuestionType = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await QuestionType.findByIdAndDelete(id);

    res.status(200).json({
        status: true,
        message: "Question Type deleted successfully"
    });
});

module.exports = {
    addQuestionType,
    getQuestionTypeList,
    updateQuestionType,
    deleteQuestionType
};
