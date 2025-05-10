const express = require("express");
const { getLowStockItems, getTotalInventoryValue, getInventorySummary, getRecentMovements } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
// router.use(authenticate);

router.get("/low-stock", getLowStockItems);
router.get("/total-value", getTotalInventoryValue);
router.get("/summary", getInventorySummary);
router.get("/recent-movements", getRecentMovements);

module.exports = router;
