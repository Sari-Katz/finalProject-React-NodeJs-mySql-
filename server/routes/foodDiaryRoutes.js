const express = require('express');
const multer = require('multer');
const foodDiaryController = require('../controllers/foodDiaryController');

const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure multer for in-memory storage to process the image buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route for meal analysis
// It accepts a single file with the field name 'mealImage'
router.post('/analyze', upload.single('mealImage'), foodDiaryController.analyzeMeal);

// Define the route to get today's calorie status for the logged-in user
router.get('/today', authenticateToken, foodDiaryController.getTodaysStatus);

// Define the route to log a meal's calories
router.post('/log', authenticateToken, foodDiaryController.logMeal);

module.exports = router;