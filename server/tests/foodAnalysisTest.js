/**
 * @jest-environment node
 */

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: jest.fn()
      }))
    }))
  };
});

const {
  analyzeMealWithGemini,
  analyzeActivityWithGemini
} = require('../services/foodAnalysisService');

const { GoogleGenerativeAI } = require('@google/generative-ai');

describe('Food Analysis Service - Unit Tests', () => {
  let mockGenerateContent;

  beforeEach(() => {
    jest.clearAllMocks();

    const genAIInstance = new GoogleGenerativeAI();
    const model = genAIInstance.getGenerativeModel();
    mockGenerateContent = model.generateContent;
  });

  describe('analyzeMealWithGemini', () => {
    it('should analyze meal with description only and return parsed JSON', async () => {
      const mockGeminiResponse = {
        response: {
          text: () => `
          {
            "foodItems": [
              {
                "name": "לחם",
                "amount": "פרוסה אחת",
                "calories": 80
              }
            ],
            "estimatedCalories": 80
          }
          `
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      const result = await analyzeMealWithGemini(null, 'פרוסת לחם');

      expect(result).toHaveProperty('foodItems');
      expect(result.foodItems).toHaveLength(1);
      expect(result.foodItems[0]).toEqual({
        name: 'לחם',
        amount: 'פרוסה אחת',
        calories: 80
      });
      expect(result.estimatedCalories).toBe(80);
    });

    it('should analyze meal with image and description', async () => {
      const fakeFile = {
        buffer: Buffer.from('fake-image'),
        mimetype: 'image/jpeg'
      };

      const mockGeminiResponse = {
        response: {
          text: () => `
          {
            "foodItems": [
              {
                "name": "אורז",
                "amount": "כוס אחת",
                "calories": 200
              }
            ],
            "estimatedCalories": 200
          }
          `
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      const result = await analyzeMealWithGemini(fakeFile, 'אורז');

      expect(result.foodItems[0].name).toBe('אורז');
      expect(result.estimatedCalories).toBe(200);
    });

    it('should throw error on invalid JSON from Gemini', async () => {
      const mockGeminiResponse = {
        response: {
          text: () => `NOT JSON`
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      await expect(
        analyzeMealWithGemini(null, 'טקסט שגוי')
      ).rejects.toThrow();
    });
  });

  describe('analyzeActivityWithGemini', () => {
    it('should analyze workout description and return burned calories', async () => {
      const mockGeminiResponse = {
        response: {
          text: () => `
          {
            "burnedCalories": 350
          }
          `
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      const result = await analyzeActivityWithGemini('ריצה 30 דקות');

      expect(result).toEqual({ burnedCalories: 350 });
    });

    it('should return 0 burned calories for non-workout text', async () => {
      const mockGeminiResponse = {
        response: {
          text: () => `
          {
            "burnedCalories": 0
          }
          `
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      const result = await analyzeActivityWithGemini('ישבתי על הספה');

      expect(result.burnedCalories).toBe(0);
    });

    it('should throw error on invalid JSON', async () => {
      const mockGeminiResponse = {
        response: {
          text: () => `INVALID RESPONSE`
        }
      };

      mockGenerateContent.mockResolvedValue(mockGeminiResponse);

      await expect(
        analyzeActivityWithGemini('ריצה')
      ).rejects.toThrow();
    });
  });
});
