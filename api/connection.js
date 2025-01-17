import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
        }
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}

export default connectDB;
