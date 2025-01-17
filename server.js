import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import getUserData from './api/get-user-data.js';  // Import the getUserData function
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.use(cors());  // Apply CORS with custom options

// MongoDB client connection
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        return client.db("PIA");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

app.post('/login', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});


// POST /signup route
app.post('/signup', async (req, res) => {
    console.log("POST /signup received");  // Log to check if the request hits the route

    const { email, username } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const db = await connectDB();
        const collection = db.collection('users');
        const result = await collection.insertOne({
            email,
            username,
            credit_used: 0,
            credit_limit: 0,
            total_money: 0,
            savings: 0,
            savings_goal: 0,
            profile_pic: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/default-profile-pic.webp',
            movements: [
                
            ],
            areas: [
                {
                    name: 'Entrada',
                    background: '#34a85b',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/income-icon.webp'
                },
                {
                    name: 'Comida',
                    background: '#e3d72d',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/food-icon.webp'
                },
                {
                    name: 'Gasolina',
                    background: '#3f389c',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/gas-icon.webp'
                },
                {
                    name: 'Casa',
                    background: '#fcba03',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/house-icon.webp'
                },
                {
                    name: 'Regalos',
                    background: '#a31849',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/gift-icon.webp'
                },
                {
                    name: 'Carro',
                    background: '#2481b3',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/car-icon.webp'
                },
                {
                    name: 'Transporte',
                    background: '#619198',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/transport-icon.webp'
                },
                {
                    name: 'Educación',
                    background: '#b83939',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/school-icon.webp'
                },
                {
                    name: 'Ropa',
                    background: '#66baac',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/clothing-icon.webp'
                },
                {
                    name: 'Inversión',
                    background: '#c9202e',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/investment-icon.webp'
                },
                {
                    name: 'Suscripciones',
                    background: '#312882',
                    icon: 'https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/subscriptions-icon.webp'
                }
            ],
            notifications: [

            ]
        });

        res.status(200).json({ message: "Email saved successfully!", result });
    } catch (error) {
        console.error("Error inserting email:", error);
        res.status(500).json({ message: "An error occurred while saving the email." });
    }
});

app.get('/api/profile-pic', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        // Log the email again right before the database call to ensure it's correct.

        const userData = await getUserData(email);
        if (userData && userData.profile_pic !== undefined) {
            res.json({ profile_pic: userData.profile_pic });
        } else {
            res.status(404).json({ message: "User or profile_pic not found." });
        }
    } catch (error) {
        console.error("Error fetching profile pic:", error.message);
        res.status(500).json({ message: "Error fetching profile pic." });
    }
});


app.get('/api/total-money', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const userData = await getUserData(email);
        if (userData && userData.total_money !== undefined) {
            res.json({ total_money: userData.total_money });
        } else {
            res.status(404).json({ message: "User or total_money not found." });
        }
    } catch (error) {
        console.error("Error fetching total money:", error.message);
        res.status(500).json({ message: "Error fetching total money." });
    }
});

app.get('/api/username', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const userData = await getUserData(email);
        if (userData && userData.username !== undefined) {
            res.json({ username: userData.username });
        } else {
            res.status(404).json({ message: "User or username not found." });
        }
    } catch (error) {
        console.error("Error fetching username:", error.message);
        res.status(500).json({ message: "Error fetching username." });
    }
});

app.get('/api/savings-percentage', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email });

        if (!user || user.savings === undefined || user.savings_goal === undefined) {
            return res.status(404).json({ message: "Savings or savings goal not found for this user." });
        }

        const { savings, savings_goal } = user;
        const percentage = savings_goal > 0 ? ((savings / savings_goal) * 100).toFixed(2) : 0;

        res.status(200).json({ savings, savings_goal, percentage });
    } catch (error) {
        console.error("Error fetching savings data:", error.message);
        res.status(500).json({ message: "Error fetching savings data." });
    }
});

app.get('/api/credit-percentage', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email });

        if (!user || user.credit_used === undefined || user.credit_limit === undefined) {
            return res.status(404).json({ message: "Credit Used or Credit Limit not found for this user." });
        }

        const { credit_used, credit_limit } = user;
        const percentage = credit_limit > 0 ? ((credit_used / credit_limit) * 100).toFixed(2) : 0;

        res.status(200).json({ credit_used, credit_limit, percentage });
    } catch (error) {
        console.error("Error fetching credit data:", error.message);
        res.status(500).json({ message: "Error fetching credit data." });
    }
});

app.get('/api/credit-used', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        // Fetch user data
        const userData = await getUserData(email);
        if (userData && userData.credit_used !== undefined) {
            res.json({ credit_used: userData.credit_used });
        } else {
            res.status(404).json({ message: "User or credit_used not found." });
        }
    } catch (error) {
        console.error("Error fetching credit used:", error.message);
        res.status(500).json({ message: "Error fetching credit used." });
    }
});

app.get('/api/savings', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        // Fetch user data
        const userData = await getUserData(email);
        if (userData && userData.savings !== undefined) {
            res.json({ savings: userData.savings });
        } else {
            res.status(404).json({ message: "User or savings not found." });
        }
    } catch (error) {
        console.error("Error fetching savings:", error.message);
        res.status(500).json({ message: "Error fetching savings." });
    }
});

app.get('/api/credit-limit', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const userData = await getUserData(email);
        if (userData && userData.credit_limit !== undefined) {
            res.json({ credit_limit: userData.credit_limit });
        } else {
            res.status(404).json({ message: "User or credit_limit not found." });
        }
    } catch (error) {
        console.error("Error fetching credit limit:", error.message);
        res.status(500).json({ message: "Error fetching credit limit." });
    }
});

app.get('/api/savings-goal', async (req, res) => {
    const email = req.query.email; // Fetch email from query parameter

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const userData = await getUserData(email);
        if (userData && userData.savings_goal !== undefined) {
            res.json({ savings_goal: userData.savings_goal });
        } else {
            res.status(404).json({ message: "User or savings_goal not found." });
        }
    } catch (error) {
        console.error("Error fetching savings goal:", error.message);
        res.status(500).json({ message: "Error fetching savings goal." });
    }
});

app.get("/api/areas/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const user = await getUserData(email);

        if (user) {
            res.json(user.areas); // Send only the areas array
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching areas data" });
    }
});

app.post('/api/add-movement-income', async (req, res) => {
    const { email, type, account, amount, area, date } = req.body;

    if (!email || !account || amount == null || !area || !date) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const db = await connectDB(); // Connect to the database
        const usersCollection = db.collection('users');

        // Find the user's document by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare the new movement object
        const newMovement = { type, account, amount, area, date };

        // Update fields logic
        let updatedCreditUsed = user.credit_used || 0;
        let updatedSavings = user.savings || 0;
        let updatedTotalMoney = user.total_money || 0;

        if (account === 'credit-used') {
            // Update the credit_used amount
            const previousCreditUsed = updatedCreditUsed;
            updatedCreditUsed -= amount;

            // Adjust total_money by the difference in credit_used
            const creditDifference = updatedCreditUsed - previousCreditUsed;
            updatedTotalMoney -= creditDifference;
        } else if (account === 'savings') {
            // Update savings
            updatedSavings += amount;

            // Adjust total_money accordingly
            updatedTotalMoney += amount;
        } else {
            // Adjust total_money for other accounts
            updatedTotalMoney += amount;
        }

        // If the amount is negative, it represents an outcome
        if (amount < 0) {
            // Ensure no overdraft occurs for credit-used or savings
            if (account === 'credit-used' && updatedCreditUsed < 0) {
                return res.status(400).json({ message: "Insufficient credit available." });
            }
            if (account === 'savings' && updatedSavings < 0) {
                return res.status(400).json({ message: "Insufficient savings available." });
            }
        }

        // Add the new movement to the user's movements array
        const updatedMovements = [...(user.movements || []), newMovement];

        // Update the user document in the database
        const result = await usersCollection.updateOne(
            { email },
            {
                $set: {
                    movements: updatedMovements,
                    credit_used: updatedCreditUsed,
                    savings: updatedSavings,
                    total_money: updatedTotalMoney,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: "Failed to update the user document." });
        }

        res.status(200).json({
            message: "Movement added successfully",
            updatedFields: {
                credit_used: updatedCreditUsed,
                total_money: updatedTotalMoney,
                savings: updatedSavings,
            },
        });
    } catch (error) {
        console.error("Error adding movement:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post('/api/add-movement-outcome', async (req, res) => {
    const { email, type, account, amount, area, date } = req.body;

    if (!email || !account || amount == null || !area || !date) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const db = await connectDB(); // Connect to the database
        const usersCollection = db.collection('users');

        // Find the user's document by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare the new movement object
        const newMovement = { type, account, amount, area, date };

        // Update fields logic
        let updatedCreditUsed = user.credit_used || 0;
        let updatedSavings = user.savings || 0;
        let updatedTotalMoney = user.total_money || 0;

        if (account === 'credit-used') {
            // Update the credit_used amount
            const previousCreditUsed = updatedCreditUsed;
            updatedCreditUsed += amount;

            // Adjust total_money by the difference in credit_used
            const creditDifference = updatedCreditUsed - previousCreditUsed;
            updatedTotalMoney -= creditDifference;
        } else if (account === 'savings') {
            // Update savings
            updatedSavings -= amount;

            // Adjust total_money accordingly
            updatedTotalMoney -= amount;
        } else {
            // Adjust total_money for other accounts
            updatedTotalMoney -= amount;
        }

        // If the amount is negative, it represents an outcome
        if (amount < 0) {
            // Ensure no overdraft occurs for credit-used or savings
            if (account === 'credit-used' && updatedCreditUsed < 0) {
                return res.status(400).json({ message: "Insufficient credit available." });
            }
            if (account === 'savings' && updatedSavings < 0) {
                return res.status(400).json({ message: "Insufficient savings available." });
            }
        }

        // Add the new movement to the user's movements array
        const updatedMovements = [...(user.movements || []), newMovement];

        // Update the user document in the database
        const result = await usersCollection.updateOne(
            { email },
            {
                $set: {
                    movements: updatedMovements,
                    credit_used: updatedCreditUsed,
                    savings: updatedSavings,
                    total_money: updatedTotalMoney,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: "Failed to update the user document." });
        }

        res.status(200).json({
            message: "Movement added successfully",
            updatedFields: {
                credit_used: updatedCreditUsed,
                total_money: updatedTotalMoney,
                savings: updatedSavings,
            },
        });
    } catch (error) {
        console.error("Error adding movement:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.patch('/api/update-total-money/:email', async (req, res) => {
    const { email } = req.params;
    const { amount, accountType } = req.body; // 'accountType' corresponds to the selected dropdown value

    if (!email || amount == null || !accountType) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        // Find the user by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Determine which field to update based on accountType
        let updatedFields = {};
        switch (accountType) {
            case "credit-used":
                const updatedCreditUsed = (user.credit_used || 0) + amount;
                const updatedTotalMoneyCredit = (user.total_money || 0) - amount;
                updatedFields = {
                    credit_used: updatedCreditUsed,
                    total_money: updatedTotalMoneyCredit,
                };
                console.log("Updating for credit-used: ", updatedFields);
                break;

            case "total-money":
                const updatedTotalMoney = (user.total_money || 0) + amount;
                updatedFields = { total_money: updatedTotalMoney };
                console.log("Updating for total-money: ", updatedFields);
                break;

            case "savings":
                const updatedSavings = (user.savings || 0) + amount;
                updatedFields = { savings: updatedSavings };
                console.log("Updating for savings: ", updatedFields);
                break;

            default:
                return res.status(400).json({ message: "Invalid account type" });
        }

        // Update the user document in the database
        const result = await usersCollection.updateOne(
            { email: email },
            { $set: updatedFields }
        );

        if (result.modifiedCount === 0) {
            console.log("No document modified.");
            return res.status(404).json({ message: "No changes made to the user document" });
        }

        res.status(200).json({ message: "Fields updated successfully", updatedFields });
    } catch (error) {
        console.error("Error updating fields:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/get-user-limits', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            credit_limit: user.credit_limit || 0,
            total_money: user.total_money || 0,
            savings_goal: user.savings_goal || 0,
        });
    } catch (error) {
        console.error("Error fetching user limits:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


app.post('/api/register-limits', async (req, res) => {
    const { email, creditLimit, savingsGoal, cash } = req.body;

    // Validate input
    if (!email || creditLimit == null || savingsGoal == null) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const db = await connectDB(); // Use the shared database connection method
        const usersCollection = db.collection('users');

        // Find the user's document by email
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user document with new limits
        const result = await usersCollection.updateOne(
            { email },
            {
                $set: {
                    credit_limit: creditLimit,
                    savings_goal: savingsGoal,
                    total_money: cash,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: "Failed to update the user document." });
        }

        res.status(200).json({
            message: "Limits registered successfully",
            updatedFields: {
                credit_limit: creditLimit,
                savings_goal: savingsGoal,
            },
        });
    } catch (error) {
        console.error("Error registering limits:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.get('/api/movements/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email });

        if (!user || !user.movements) {
            return res.status(404).json({ message: "User or movements not found." });
        }

        res.status(200).json({ movements: user.movements });
    } catch (error) {
        console.error("Error fetching movements:", error);
        res.status(500).json({ message: "An error occurred while fetching movements." });
    }
});

app.get('/api/user/notifications/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ email });

        if (!user || !user.notifications) {
            return res.status(404).json({ message: "User or notifications not found." });
        }

        // Send notifications array back to frontend
        res.status(200).json(user.notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "An error occurred while fetching notifications." });
    } finally {
        await client.close();  // Ensure the client connection is closed
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});