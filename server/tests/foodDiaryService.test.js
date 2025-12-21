/**
 * @jest-environment node
 */

jest.mock('../DB/Connection', () => ({
  query: jest.fn()
}));

const pool = require('../DB/Connection');
const {
  getTodaysStatus,
  logMeal,
  logActivity
} = require('../services/foodDiaryService');

describe('Food Diary Service - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodaysStatus', () => {

    it('should return daily goal and today calories', async () => {
      pool.query
        .mockResolvedValueOnce([[{ daily_calorie_goal: 2000 }]])
        .mockResolvedValueOnce([[{
          consumed_calories: 500,
          burned_calories: 300
        }]]);

      const result = await getTodaysStatus(1);

      expect(result).toEqual({
        daily_calorie_goal: 2000,
        consumed_calories: 500,
        burned_calories: 300
      });
    });

    it('should return defaults when no tracking exists', async () => {
      pool.query
        .mockResolvedValueOnce([[{ daily_calorie_goal: 1800 }]])
        .mockResolvedValueOnce([[]]);

      const result = await getTodaysStatus(2);

      expect(result).toEqual({
        daily_calorie_goal: 1800,
        consumed_calories: 0,
        burned_calories: 0
      });
    });

    it('should throw error when user not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      await expect(getTodaysStatus(99))
        .rejects
        .toThrow('User not found');
    });

  });

  describe('logMeal', () => {

    it('should insert or update consumed calories', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await logMeal(1, 400);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual({ affectedRows: 1 });
    });

  });

  describe('logActivity', () => {

    it('should insert or update burned calories', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await logActivity(1, 250);

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual({ affectedRows: 1 });
    });

  });

});
