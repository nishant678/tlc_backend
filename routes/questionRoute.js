// routes/questionRoute.js
const express = require("express");
const {
    addQuestion,
    getQuestionsByType,
    getQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controller/questionCtrl");

const router = express.Router();

router.post("/add", addQuestion);
router.get("/list/:questionTypeId", getQuestionsByType);
router.get("/:id", getQuestion);
router.put("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);

module.exports = router;
