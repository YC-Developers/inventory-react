const { Sequelize } = require("sequelize")
const dotenv = require("dotenv")
dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV !== "production" ? console.log : false,
})

module.exports = sequelize
