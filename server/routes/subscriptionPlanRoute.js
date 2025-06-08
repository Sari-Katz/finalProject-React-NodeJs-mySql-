const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlanController');

// כל חבילות המנוי
router.get('/', subscriptionPlanController.getAllPlans);

// חבילה לפי מזהה
router.get('/:id', subscriptionPlanController.getPlanById);

// יצירת חבילה חדשה
router.post('/create', subscriptionPlanController.createPlan);

// עדכון חבילה
router.put('/:id', subscriptionPlanController.updatePlan);

// מחיקת חבילה
router.delete('/:id', subscriptionPlanController.deletePlan);

module.exports = router;
