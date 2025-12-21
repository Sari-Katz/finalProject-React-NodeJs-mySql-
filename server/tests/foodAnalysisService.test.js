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
  analyzeActivityWithGemini
} = require('../services/foodAnalysisService');

describe('Food Analysis Service - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
});
