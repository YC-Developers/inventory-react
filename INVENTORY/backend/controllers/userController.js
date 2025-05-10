const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Sequelize, Op } = require("../models/Index");

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};
// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, password } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check for duplicate username or email if they're being updated
        if (username || email) {
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        username ? { username } : null,
                        email ? { email } : null
                    ].filter(Boolean),
                    userId: { [Op.ne]: userId }
                }
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username or email already exists" });
            }
        }

        // Update user fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
