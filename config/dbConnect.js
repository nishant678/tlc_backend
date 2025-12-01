const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        // MongoDB connection string - update this with your MongoDB connection string
        const MONGODB_URL = "mongodb://localhost:27017/tlc_backend";
        
        const conn = await mongoose.connect(MONGODB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}
module.exports = dbConnect;