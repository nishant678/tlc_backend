const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const {
    addQuestionType,
    getQuestionTypeList,
    updateQuestionType,
    deleteQuestionType
} = require("../controller/questionTypeCtrl");

const router = express.Router();

router.post("/add", authMiddleware, upload.single("image"), addQuestionType);
router.get("/list", authMiddleware, getQuestionTypeList);
router.post("/update/:id", authMiddleware, upload.single("image"), updateQuestionType);
router.delete("/delete/:id", authMiddleware, deleteQuestionType);

module.exports = router;
