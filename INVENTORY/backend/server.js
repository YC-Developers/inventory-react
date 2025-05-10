const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { sequelize } = require("./config/database")  
const userRoute = require("./routes/userRoute")
const categoryRoute = require("./routes/categoryRoute")
const productRoute = require("./routes/productRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const stockMovementRoute = require("./routes/stockMovementRoute")
const dashboardRoute = require("./routes/dashboardRoute")

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/products", productRoute)
app.use("/api/inventory", inventoryRoute)
app.use("/api/stock-movements", stockMovementRoute)
app.use("/api/dashboard", dashboardRoute)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tectona Furniture Inventory Management API" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
})

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")

    // Sync database models (in production, use migrations instead)
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true })
      console.log("Database models synchronized")
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

startServer()
