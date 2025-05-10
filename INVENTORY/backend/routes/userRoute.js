const express = require("express");
const { register, login, getProfile, updateProfile } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

module.exports = router;
