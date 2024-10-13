const express = require('express');
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all habits for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching habits' });
  }
});

// Add a new habit
router.post('/', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const newHabit = new Habit({ title, userId: req.user.id });
  try {
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ error: 'Error adding habit' });
  }
});

// Update a habit
router.put('/:id', authMiddleware, async (req, res) => {
  const { completed } = req.body;
  try {
    const habit = await Habit.findByIdAndUpdate(req.params.id, { completed, updatedAt: Date.now() }, { new: true });
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Error updating habit' });
  }
});

// Delete a habit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting habit' });
  }
});

module.exports = router;
