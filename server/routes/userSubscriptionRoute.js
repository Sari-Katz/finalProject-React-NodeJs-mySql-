const express = require('express');
const router = express.Router();
const userSubscriptionController = require('../controllers/userSubscriptionController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// כל המנויים
router.get('/',authenticateToken,requireRole('admin'), userSubscriptionController.getAllSubscriptions);


// בדיקת מנוי לפי מזהה משתמש
router.get('/user', authenticateToken,userSubscriptionController.getSubscriptionByUserId);

// יצירת מנוי חדש
router.post('/create',authenticateToken, userSubscriptionController.createSubscription);

// עדכון מנוי
router.put('/:id',authenticateToken, userSubscriptionController.updateSubscription);

module.exports = router;
