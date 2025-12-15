const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Converts a file buffer from multer into a format that Gemini can understand.
 * @param {Buffer} buffer The image buffer.
 * @param {string} mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns {object} An object with inlineData for the Gemini API.
 */
const fileToGenerativePart = (buffer, mimeType) => {
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType,
        },
    };
};

/**
 * Analyzes a meal using an image and/or a text description with Google Gemini.
 * @param {string} description - The text description of the meal (optional).
 * @param {object} file - The image file object from multer (optional).
 * @returns {Promise<object>} A promise that resolves to the analysis result.
 */
const analyzeMealWithGemini = async (file, description) => {
    // Use the gemini-pro-vision model for multimodal input
   const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
});


const prompt = `
Analyze the following meal. Identify all visible food items and provide a realistic estimation
of the total calories.

If there is an image, prioritize it. If there is also a description, use it for additional context.

IMPORTANT RULES:
- All food names MUST be in Hebrew.
- All quantity / size descriptions MUST be in Hebrew.
- Use realistic, human-friendly portions (e.g. "פרוסה אחת", "כוס קטנה", "צלחת בינונית").
- Provide an estimated calorie value for EACH food item.
- The response language MUST be Hebrew.
- JSON keys must remain in English exactly as specified.

Your response MUST be a valid JSON object with the following structure:
{
  "foodItems": [
    {
      "name": "שם המאכל",
      "amount": "תיאור כמות או גודל",
      "calories": <number>
    }
  ],
  "estimatedCalories": <number>
}

Do NOT include any text outside of this JSON object.
`;




    const parts = [{ text: prompt }];
    if (file) {
        const imagePart = fileToGenerativePart(file.buffer, file.mimetype);
        parts.push(imagePart);
    }

    if (description) {
        parts.push({ text: `Description: ${description}` });
    }

    const result = await model.generateContent({ contents: [{ parts }] });
    const responseText = result.response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
};

module.exports = { analyzeMealWithGemini };
