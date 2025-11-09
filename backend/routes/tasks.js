const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');

// Apply the verifyToken middleware to all routes in this file
router.use(verifyToken);

// GET all tasks for the authenticated user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching tasks.' });
    }
});

// POST a new task for the authenticated user
router.post('/', async (req, res) => {
    try {
        const { title, priority, tag, dueDate, reminder, reminderLeadTime } = req.body;
        const newTask = new Task({
            userId: req.user.uid,
            title,
            priority,
            tag,
            dueDate,
            reminder,
            reminderLeadTime,
            completed: false,
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: 'Invalid task data.' });
    }
});

// PUT (update) a task by its ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the task belongs to the authenticated user before updating
        const task = await Task.findOne({ _id: id, userId: req.user.uid });

        if (!task) {
            return res.status(440).json({ error: 'Task not found or you do not have permission to edit it.' });
        }
        
        // Update fields provided in the body
        Object.assign(task, req.body);
        
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data for update.' });
    }
});

// DELETE a task by its ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the task belongs to the authenticated user before deleting
        const result = await Task.deleteOne({ _id: id, userId: req.user.uid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
        }
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting task.' });
    }
});

// DELETE all completed tasks for the authenticated user
router.delete('/history', async (req, res) => {
    try {
        const userId = req.user.uid;
        await Task.deleteMany({ userId: userId, completed: true });
        res.status(200).json({ message: 'Completed tasks cleared successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while clearing history.' });
    }
});


module.exports = router;