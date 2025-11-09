require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const taskRoutes = require('./routes/tasks');

// Initialize Firebase Admin SDK
require('./config/firebaseAdmin');

const app = express();
// Add this line to fix the X-Forwarded-For warning and enable correct rate limiting:
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'https://focuslyy.netlify.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

// JSON middleware
app.use(express.json());

// Rate Limiting to prevent abuse
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ok" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Could not connect to MongoDB Atlas');
        console.error(err);
        process.exit(1);
    });
