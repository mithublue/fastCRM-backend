import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
	try {
		const { email, password, name } = req.body;

		// Check if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const user = new User({
			email,
			password: hashedPassword,
			name,
		});
		await user.save();

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Get Current User (Protected Route)
router.get('/me', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({ user });
	} catch (error) {
		res.status(401).json({ message: 'Invalid token', error: error.message });
	}
});

export default router;
