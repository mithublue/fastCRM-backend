import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update `updatedAt` on save
userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

const User = mongoose.model('User', userSchema);
export default User;
