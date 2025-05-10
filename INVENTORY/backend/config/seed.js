const { sequelize } = require("./database")
const User = require("../models/User")
const Category = require("../models/Category")
const Product = require("../models/Product")
const Inventory = require("../models/Inventory")
const StockMovement = require("../models/StockMovement")

// Seed data function
const seedDatabase = async () => {
    try {
        // Sync database models
        await sequelize.sync({ force: true })
        console.log("Database synced")

        // Create admin user
        const admin = await User.create({
            username: "Yannick",
            email: "gisubizoaimeyannick@gmail.com",
            password: "yannick123",
        })

        // Create categories
        const categories = await Category.bulkCreate([
            {
                name: "Living Room",
                description: "Furniture for living rooms",
            },
            {
                name: "Bedroom",
                description: "Furniture for bedrooms",
            },
            {
                name: "Dining",
                description: "Furniture for dining areas",
            },
            {
                name: "Office",
                description: "Furniture for offices",
            },
            {
                name: "Outdoor",
                description: "Furniture for outdoor spaces",
            },
        ])

        // Create products
        const products = await Product.bulkCreate([
            {
                name: "Tectona Sofa",
                sku: "TF-LR-001",
                description: "Comfortable 3-seater sofa",
                categoryId: categories[0].categoryId,
                price: 899.99,
                minimumStock: 5,
                imageUrl: "https://example.com/images/sofa.jpg",
            },
            {
                name: "Tectona Bed Frame",
                sku: "TF-BR-001",
                description: "Queen size bed frame",
                categoryId: categories[1].categoryId,
                price: 599.99,
                minimumStock: 3,
                imageUrl: "https://example.com/images/bed.jpg",
            },
            {
                name: "Tectona Dining Table",
                sku: "TF-DT-001",
                description: "6-seater dining table",
                categoryId: categories[2].categoryId,
                price: 499.99,
                minimumStock: 2,
                imageUrl: "https://example.com/images/dining-table.jpg",
            },
            {
                name: "Tectona Office Desk",
                sku: "TF-OF-001",
                description: "Modern office desk",
                categoryId: categories[3].categoryId,
                price: 349.99,
                minimumStock: 4,
                imageUrl: "https://example.com/images/desk.jpg",
            },
            {
                name: "Tectona Patio Set",
                sku: "TF-OD-001",
                description: "4-piece patio furniture set",
                categoryId: categories[4].categoryId,
                price: 799.99,
                minimumStock: 2,
                imageUrl: "https://example.com/images/patio.jpg",
            },
        ])

        // Create inventory records
        const inventories = await Inventory.bulkCreate([
            {
                productId: products[0].productId,
                quantity: 10,
            },
            {
                productId: products[1].productId,
                quantity: 5,
            },
            {
                productId: products[2].productId,
                quantity: 3,
            },
            {
                productId: products[3].productId,
                quantity: 8,
            },
            {
                productId: products[4].productId,
                quantity: 4,
            },
        ])

        // Create stock movement records
        await StockMovement.bulkCreate([
            {
                productId: products[0].productId,
                quantity: 10,
                type: "add",
                notes: "Initial stock",
                userId: admin.userId,
            },
            {
                productId: products[1].productId,
                quantity: 5,
                type: "add",
                notes: "Initial stock",
                userId: admin.userId,
            },
            {
                productId: products[2].productId,
                quantity: 3,
                type: "add",
                notes: "Initial stock",
                userId: admin.userId,
            },
            {
                productId: products[3].productId,
                quantity: 8,
                type: "add",
                notes: "Initial stock",
                userId: admin.userId,
            },
            {
                productId: products[4].productId,
                quantity: 4,
                type: "add",
                notes: "Initial stock",
                userId: admin.userId,
            },
        ])

        console.log("Database seeded successfully")
    } catch (error) {
        console.error("Error seeding database:", error)
    }
}

// Export the function using CommonJS syntax
module.exports = { seedDatabase }

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log("Seeding completed")
            process.exit(0)
        })
        .catch((error) => {
            console.error("Seeding failed:", error)
            process.exit(1)
        })
}
