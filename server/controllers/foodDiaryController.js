const { analyzeMealWithGemini } = require('../services/foodAnalysisService');

/**
 * Controller to handle meal analysis requests.
 */
const analyzeMeal = async (req, res) => {
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

module.exports = {
    analyzeMeal,
};