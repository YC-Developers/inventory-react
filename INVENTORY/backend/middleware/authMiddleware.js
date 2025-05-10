const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. Please provide a valid token." })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Attach user to request object
    req.user = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    }

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    return res.status(500).json({ message: "Authentication error", error: error.message })
  }
}

module.exports = { authenticate }
