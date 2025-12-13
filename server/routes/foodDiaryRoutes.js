const express = require('express');
const multer = require('multer');
const foodDiaryController = require('../controllers/foodDiaryController');

const router = express.Router();

// Configure multer for in-memory storage to process the image buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route for meal analysis
// It accepts a single file with the field name 'mealImage'
router.post('/analyze', upload.single('mealImage'), foodDiaryController.analyzeMeal);

module.exports = router;