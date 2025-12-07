const Question = require("../model/questionModel");
const asyncHandler = require("express-async-handler");

exports.addQuestion = asyncHandler(async (req, res) => {
    const {
        questionTypeId,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption
    } = req.body;

    if (!questionTypeId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
        return res.status(400).json({ message: "All fields required" });
    }

    const question = await Question.create({
        questionTypeId,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption
    });

    res.status(201).json({ message: "Question created", question });
});

// ➤ Get Questions by QuestionType
exports.getQuestionsByType = asyncHandler(async (req, res) => {
    const { questionTypeId } = req.params;
    const list = await Question.find({ questionTypeId });

    res.json({ list });
});

// ➤ Get Single Question
exports.getQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const q = await Question.findById(id);

    if (!q) return res.status(404).json({ message: "Not found" });

    res.json({ q });
});

// ➤ Update Question
exports.updateQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = {
        questionText: req.body.questionText,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        correctOption: req.body.correctOption,
        questionTypeId: req.body.questionTypeId
    };

    const updated = await Question.findByIdAndUpdate(id, data, { new: true });

    res.json({ message: "Updated", updated });
});

// ➤ Delete Question
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
});
