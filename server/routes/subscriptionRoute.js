const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// כל חבילות המנוי

router.get('/plans', authenticateToken,subscriptionController.getAllPlans);

//כל המנויים
router.get('/',authenticateToken,requireRole('admin'), subscriptionController.getAllSubscriptions);

///בדיקת משתמש האם יש לו מנו
router.get('/user/isActive', authenticateToken,subscriptionController.getSubscriptionByUserId);


 router.post('/:subscriptionId/register',  authenticateToken,subscriptionController.registerToSubscription);

module.exports = router;
