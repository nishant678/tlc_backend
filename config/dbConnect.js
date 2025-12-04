const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        const MONGODB_URL = "mongodb+srv://Test:Welcome%401998@tlccluster.kuc520m.mongodb.net/tlc_db?retryWrites=true&w=majority";

        const conn = await mongoose.connect(MONGODB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}
module.exports = dbConnect;