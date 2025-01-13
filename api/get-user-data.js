import connectDB from './connection.js';

async function getUserData(email) {
    try {
        const client = await connectDB();
        const database = client.db("PIA");
        const collection = database.collection("users");

        const user = await collection.findOne({ email });
        return user;
    } catch (error) {
        console.error("Error fetching user data from MongoDB:", error.message);
        throw error;
    }
}

export default getUserData;
