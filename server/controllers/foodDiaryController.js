const { analyzeMealWithGemini } = require('../services/foodAnalysisService');
const foodDiaryService = require('../services/foodDiaryService');

/**
 * Controller to handle meal analysis requests.
 */
exports.analyzeMeal = async (req, res) => {
    const { file } = req; // The image file from multer
   const { description } = req.body; // The text description
    // console.log('Received description:', description);
    if (!file && !description) {
        return res.status(400).json({ message: 'Please provide an image or a description to analyze.' });
    }

    try {
        const analysisResult = await analyzeMealWithGemini(file, description);
        console.log('Analysis result:', analysisResult);
        res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error analyzing meal with Gemini:', error);
        res.status(500).json({ message: 'Failed to analyze meal. Please try again.' });
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