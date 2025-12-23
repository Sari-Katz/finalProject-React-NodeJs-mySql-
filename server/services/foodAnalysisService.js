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

/**
 * Analyzes a workout description with Google Gemini to estimate burned calories.
 * @param {string} description - A text description of the workout.
 * @returns {Promise<object>} A promise that resolves to the analysis result.
 */
const analyzeActivityWithGemini = async (description) => {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `
        Analyze the following workout description and provide a realistic estimation of the calories burned.
        Base your analysis on the type of activity, duration, and intensity mentioned.

        Description: "${description}"

        Your response MUST be a valid JSON object with the following structure:
        {
          "burnedCalories": <estimated_calories_as_a_number>
        }

        Do not include any text outside of this JSON object.
        If the description is not a workout, return { "burnedCalories": 0 }.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
};
/**
 * Provides meal recommendations based on remaining calories and time of day.
 */
const getMealRecommendationsWithGemini = async ({
    dailyGoal,
    consumedCalories,
    burnedCalories,
    currentHour
}) => {
  console.log('🔥 CALLING GEMINI 🔥', new Date().toISOString());
    const remainingCalories =
        dailyGoal - consumedCalories + burnedCalories;

    const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash"
    });

const prompt = `
You are a professional nutritionist AI.

USER DAILY DATA:
- Daily calorie goal: ${dailyGoal}
- Calories consumed today: ${consumedCalories}
- Calories burned today: ${burnedCalories}
- Remaining calories for today: ${remainingCalories}
- Current hour (0–23): ${currentHour}

TASK:
Recommend 2 to 3 meal ideas that fit the remaining calories.
The meal type MUST match the current time of day:
- Morning (05–10) → Breakfast
- Midday (11–16) → Lunch
- Evening (17–22) → Dinner
- Late hours (23–04) → Light meal / Snack

RULES (VERY IMPORTANT):
- ALL text values must be in Hebrew
- Use realistic, human-sized portions
- Estimated calories must NOT exceed remaining calories
- Be practical and healthy
- Do NOT add explanations outside JSON
- Do NOT use markdown
- Do NOT wrap the response in \`\`\`
- Return VALID JSON ONLY

RESPONSE FORMAT (MUST MATCH EXACTLY):

{
  "mealType": "בוקר | צהריים | ערב | נשנוש",
  "recommendations": [
    {
      "name": "שם הארוחה",
      "estimatedCalories": 0,
      "description": "תיאור קצר של הארוחה"
    }
  ]
}

If remaining calories are very low, suggest lighter meals.
If remaining calories are high, suggest balanced full meals.
`;


    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, '').trim();
    console.log("Gemini Meal Recommendations Response:", clean);
    return JSON.parse(clean);
};


module.exports = { analyzeMealWithGemini, analyzeActivityWithGemini, getMealRecommendationsWithGemini };
