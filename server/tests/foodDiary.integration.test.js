/**
 * @jest-environment node
 */

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// ===== MOCKS =====
jest.mock('../services/foodAnalysisService', () => ({
  analyzeMealWithGemini: jest.fn(),
  analyzeActivityWithGemini: jest.fn(),
}));

jest.mock('../services/foodDiaryService', () => ({
  getTodaysStatus: jest.fn(),
  logMeal: jest.fn(),
  logActivity: jest.fn(),
}));

// Mock auth middleware
jest.mock('../middlewares/authMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1 };
    next();
  },
}));

const foodDiaryRoutes = require('../routes/foodDiaryRoutes');
const foodAnalysisService = require('../services/foodAnalysisService');
const foodDiaryService = require('../services/foodDiaryService');

// ===== TEST APP =====
const app = express();
app.use(bodyParser.json());
app.use('/food-diary', foodDiaryRoutes);

describe('Food Diary API – Integration Tests', () => {

  describe('POST /food-diary/analyze', () => {
    it('should return 400 if no image and no description provided', async () => {
      const res = await request(app).post('/food-diary/analyze');
      expect(res.status).toBe(400);
    });

    it('should analyze meal and return result', async () => {
      foodAnalysisService.analyzeMealWithGemini.mockResolvedValue({
        foodItems: [{ name: 'אורז', calories: 200 }],
        estimatedCalories: 200,
      });

      const res = await request(app)
        .post('/food-diary/analyze')
        .send({ description: 'אורז' });

      expect(res.status).toBe(200);
      expect(res.body.estimatedCalories).toBe(200);
    });
  });

  describe('GET /food-diary/today', () => {
    it('should return today calorie status', async () => {
      foodDiaryService.getTodaysStatus.mockResolvedValue({
        daily_calorie_goal: 2000,
        consumed_calories: 500,
        burned_calories: 300,
      });

      const res = await request(app).get('/food-diary/today');

      expect(res.status).toBe(200);
      expect(res.body.daily_calorie_goal).toBe(2000);
    });
  });

  describe('POST /food-diary/log', () => {
    it('should return 400 for invalid calories', async () => {
      const res = await request(app)
        .post('/food-diary/log')
        .send({ calories: -5 });

      expect(res.status).toBe(400);
    });

    it('should log meal calories', async () => {
      foodDiaryService.logMeal.mockResolvedValue({ affectedRows: 1 });

      const res = await request(app)
        .post('/food-diary/log')
        .send({ calories: 300 });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /food-diary/analyze-activity', () => {
    it('should analyze activity description', async () => {
      foodAnalysisService.analyzeActivityWithGemini.mockResolvedValue({
        burnedCalories: 250,
      });

      const res = await request(app)
        .post('/food-diary/analyze-activity')
        .send({ description: 'ריצה 30 דקות' });

      expect(res.status).toBe(200);
      expect(res.body.burnedCalories).toBe(250);
    });
  });

  describe('POST /food-diary/log-activity', () => {
    it('should log burned calories', async () => {
      foodDiaryService.logActivity.mockResolvedValue({ affectedRows: 1 });

      const res = await request(app)
        .post('/food-diary/log-activity')
        .send({ burned_calories: 400 });

      expect(res.status).toBe(200);
    });
  });
});
