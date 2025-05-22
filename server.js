import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
	origin: 'http://localhost:5173', // Allow frontend origin
	credentials: true,
}));
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

// Test Route
app.get('/', (req, res) => {
	res.send('CRM Backend is running');
});

// Start Server
const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
};

startServer();
