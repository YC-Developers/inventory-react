const express = require("express");
const {
  getAllStockMovements,
  getProductStockMovements,
  getStockMovementById,
} = require("../controllers/stockMovementController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getAllStockMovements);
router.get("/product/:productId", getProductStockMovements);
router.get("/:id", getStockMovementById);

module.exports = router;
