/**
 * @jest-environment node
 */

const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: mockGenerateContent
      }))
    }))
  };
});

const {
  analyzeMealWithGemini,
  analyzeActivityWithGemini,
  getMealRecommendationsWithGemini
} = require('../services/foodAnalysisService');

describe('Food Analysis Service - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // analyzeMealWithGemini
  // ===============================
  describe('analyzeMealWithGemini', () => {

    it('should analyze meal with description only', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            foodItems: [
              { name: 'לחם', amount: 'פרוסה אחת', calories: 80 }
            ],
            estimatedCalories: 80
          })
        }
      });

      const result = await analyzeMealWithGemini(null, 'פרוסת לחם');

      expect(result.estimatedCalories).toBe(80);
      expect(result.foodItems.length).toBe(1);
    });

    it('should analyze meal with image and description', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            foodItems: [
              { name: 'אורז', amount: 'כוס אחת', calories: 200 }
            ],
            estimatedCalories: 200
          })
        }
      });

      const fakeFile = {
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/jpeg'
      };

      const result = await analyzeMealWithGemini(fakeFile, 'אורז');

      expect(result.estimatedCalories).toBe(200);
    });

    it('should throw error on invalid JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'NOT JSON'
        }
      });

      await expect(
        analyzeMealWithGemini(null, 'טקסט שגוי')
      ).rejects.toThrow();
    });
  });

  // ===============================
  // analyzeActivityWithGemini
  // ===============================
  describe('analyzeActivityWithGemini', () => {

    it('should return burned calories', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({ burnedCalories: 350 })
        }
      });

      const result = await analyzeActivityWithGemini('ריצה 30 דקות');

      expect(result.burnedCalories).toBe(350);
    });

    it('should return 0 for non workout text', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({ burnedCalories: 0 })
        }
      });

      const result = await analyzeActivityWithGemini('ישבתי על הספה');

      expect(result.burnedCalories).toBe(0);
    });
  });

  // ===============================
  // getMealRecommendationsWithGemini
  // ===============================
  describe('getMealRecommendationsWithGemini', () => {

    it('should return valid meal recommendations JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            mealType: 'ערב',
            recommendations: [
              {
                name: 'חביתה וסלט',
                estimatedCalories: 450,
                description: '2 ביצים עם סלט ירקות'
              }
            ]
          })
        }
      });

      const result = await getMealRecommendationsWithGemini({
        dailyGoal: 2000,
        consumedCalories: 1200,
        burnedCalories: 200,
        currentHour: 19
      });

      expect(result.mealType).toBe('ערב');
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should respect remaining calories limit', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            mealType: 'נשנוש',
            recommendations: [
              {
                name: 'יוגורט',
                estimatedCalories: 100,
                description: 'יוגורט קטן'
              }
            ]
          })
        }
      });

      const result = await getMealRecommendationsWithGemini({
        dailyGoal: 1800,
        consumedCalories: 1700,
        burnedCalories: 0,
        currentHour: 23
      });

      expect(result.recommendations[0].estimatedCalories).toBeLessThanOrEqual(100);
    });

    it('should throw error on invalid JSON response', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'INVALID JSON'
        }
      });

      await expect(
        getMealRecommendationsWithGemini({
          dailyGoal: 2000,
          consumedCalories: 1000,
          burnedCalories: 300,
          currentHour: 12
        })
      ).rejects.toThrow();
    });

  });

});
