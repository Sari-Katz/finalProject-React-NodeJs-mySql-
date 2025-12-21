const { analyzeMealWithGemini, analyzeActivityWithGemini } = require('../services/foodAnalysisService');
const foodDiaryService = require('../services/foodDiaryService');

/**
 * Controller to handle meal analysis requests.
 */
exports.analyzeMeal = async (req, res) => {
    const file = req.file;
    const description = req.body?.description;

    // ✅ עצירה מיידית – לפני try
    if (!file && (!description || description.trim() === '')) {
        return res.status(400).json({
            message: 'Please provide an image or a description to analyze.'
        });
    }

    try {
        const analysisResult = await analyzeMealWithGemini(file, description);
        return res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error analyzing meal with Gemini:', error);
        return res.status(500).json({
            message: 'Failed to analyze meal. Please try again.'
        });
    }
};


/**
 * Controller to get today's calorie status for the logged-in user.
 */
exports.getTodaysStatus = async (req, res) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const status = await foodDiaryService.getTodaysStatus(userId);
        res.status(200).json(status);
    } catch (error) {
        console.error('Error fetching today\'s calorie status:', error);
        res.status(500).json({ message: 'Failed to fetch daily status. Please try again.' });
    }
};


/**
 * Controller to log a meal's calories for the logged-in user.
 */
exports.logMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calories } = req.body;

        if (typeof calories !== 'number' || calories < 0) {
            return res.status(400).json({ message: 'ערך קלוריות לא תקין.' });
        }

        await foodDiaryService.logMeal(userId, calories);

        res.status(200).json({ message: 'הארוחה תועדה בהצלחה.' });
    } catch (error) {
        console.error("Error logging meal:", error);
        res.status(500).json({ message: 'שגיאה בתיעוד הארוחה.' });
    }
};

/**
 * Controller to handle workout analysis requests.
 */
exports.analyzeActivity = async (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'Please provide a description to analyze.' });
    }

    try {
        const analysisResult = await analyzeActivityWithGemini(description);
        res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error analyzing activity with Gemini:', error);
        res.status(500).json({ message: 'Failed to analyze activity. Please try again.' });
    }
};

/**
 * Controller to log burned calories from an activity for the logged-in user.
 */
exports.logActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { burned_calories } = req.body;

        if (typeof burned_calories !== 'number' || burned_calories < 0) {
            return res.status(400).json({ message: 'ערך קלוריות לא תקין.' });
        }

        await foodDiaryService.logActivity(userId, burned_calories);
        res.status(200).json({ message: 'הפעילות תועדה בהצלחה.' });
    } catch (error) {
        console.error("Error logging activity:", error);
        res.status(500).json({ message: 'שגיאה בתיעוד הפעילות.' });
    }
};