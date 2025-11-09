const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  tag: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  reminder: { type: Boolean, default: false },
  reminderLeadTime: { type: Number }, // Time in minutes before due date
  repeatDaily: { type: Boolean, default: false }, // New field for daily tasks
  completionDate: { type: Date }, // Field to track when a task was completed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);