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
        const { title, priority, tag, dueDate, reminder, reminderLeadTime, repeatDaily } = req.body;
        const newTask = new Task({
            userId: req.user.uid,
            title,
            priority,
            tag,
            dueDate,
            reminder,
            reminderLeadTime,
            repeatDaily, // Add new field
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
        const task = await Task.findOne({ _id: id, userId: req.user.uid });

        if (!task) {
            return res.status(404).json({ error: 'Task not found or you do not have permission to edit it.' });
        }
        
        // If a task is being marked as complete, set the completionDate
        if (req.body.completed === true && !task.completed) {
            req.body.completionDate = new Date();
        } else if (req.body.completed === false) {
            req.body.completionDate = null;
        }

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
        // Do not delete completed daily tasks, they should be reset
        await Task.deleteMany({ userId: userId, completed: true, repeatDaily: { $ne: true } });
        res.status(200).json({ message: 'Completed tasks cleared successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while clearing history.' });
    }
});


module.exports = router;