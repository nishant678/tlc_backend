const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        // MongoDB connection string - update this with your MongoDB connection string
        // NOTE: special characters in the password (like @) must be URL-encoded.
        // If your password is `Welcome@1998`, it becomes `Welcome%401998` in the URI.
        const MONGODB_URL = "mongodb+srv://Test:Welcome%401998@tlccluster.kuc520m.mongodb.net/tlc_db?retryWrites=true&w=majority";

        const conn = await mongoose.connect(MONGODB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}
module.exports = dbConnect;