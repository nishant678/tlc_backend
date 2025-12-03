const User = require("../model/userModel");

/**
 * Ensures MongoDB collections and indexes exist before the app starts
 */
const initializeCollections = async () => {
    try {
        await User.init(); // creates the underlying collection + indexes if missing
        console.log("Verified MongoDB collections/indexes");
    } catch (error) {
        console.error("Failed to initialize MongoDB collections:", error.message);
        throw error;
    }
};

module.exports = initializeCollections;


