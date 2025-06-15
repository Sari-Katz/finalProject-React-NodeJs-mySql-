const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// כל חבילות המנוי

router.get('/plans', authenticateToken,subscriptionController.getAllPlans);

// // חבילה לפי מזהה
// router.get('/:id', subscriptionPlanController.getPlanById);

 router.post('/:subscriptionId/register',  authenticateToken,subscriptionController.registerToSubscription);

// // עדכון חבילה
// router.put('/:id', subscriptionPlanController.updatePlan);

// // מחיקת חבילה
// router.delete('/:id', subscriptionPlanController.deletePlan);


module.exports = router;
