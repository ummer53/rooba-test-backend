const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const { MongoClient } = require('mongodb');

// Get all users
router.get('/users', async (req, res) => {
	try {
		const users = await User.find({}, '-password');
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id, '-password');
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get user stats
router.get('/stats', async (req, res) => {
	const uri = 'mongodb://localhost:27017';
	const client = new MongoClient(uri);

	try {
		const pipeline = [
			{
				$group: {
					_id: null,
					totalUsers: { $sum: 1 },
					averageAge: { $avg: '$age' },
					countries: { $addToSet: '$country' },
				},
			},
			{
				$project: {
					_id: 0,
					totalUsers: 1,
					averageAge: 1,
					uniqueCountries: { $size: '$countries' },
				},
			},
		];

		const result = await User.aggregate(pipeline);

		res.json(result);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	} finally {
		await client.close();
	}
});

// Create a new user
router.post('/users', async (req, res) => {
	try {
		const newUser = await User.create(req.body);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ error: 'Bad Request' });
	}
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updatedUser);
	} catch (error) {
		res.status(400).json({ error: 'Bad Request' });
	}
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.sendStatus(204);
	} catch (error) {
		res.status(400).json({ error: 'Bad Request' });
	}
});

module.exports = router;
