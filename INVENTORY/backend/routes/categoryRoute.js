const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
