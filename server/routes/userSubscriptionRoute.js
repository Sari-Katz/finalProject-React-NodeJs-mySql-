const express = require('express');
const router = express.Router();
const userSubscriptionController = require('../controllers/userSubscriptionController');
const {authenticateToken} = require("../middlewares/authMiddleware");

// כל המנויים
router.get('/', userSubscriptionController.getAllSubscriptions);

// מנוי לפי מזהה
router.get('/:id', userSubscriptionController.getSubscriptionById);

// בדיקת מנוי לפי מזהה משתמש
router.get('/byUser/:userId',  authenticateToken,userSubscriptionController.getSubscriptionByUserId);

// יצירת מנוי חדש
router.post('/create', userSubscriptionController.createSubscription);

// עדכון מנוי
router.put('/:id', userSubscriptionController.updateSubscription);

// מחיקת מנוי
router.delete('/:id', userSubscriptionController.deleteSubscription);

module.exports = router;
