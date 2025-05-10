const express = require("express");
const inventoryController = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.authenticate);

router.get("/", inventoryController.getAllInventory);
router.get("/:productId", inventoryController.getProductInventory);
router.post("/:productId", inventoryController.updateInventory);

module.exports = router;
