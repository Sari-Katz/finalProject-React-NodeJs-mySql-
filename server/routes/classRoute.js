const express = require('express');
const classController = require('../controllers/classController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// יצירת כיתה חדשה
router.post('/create', authenticateToken, requireRole('admin'), classController.createClass);

// קבלת כל הכיתות (עם אפשרות לסינון)
router.get('/', authenticateToken,classController.getClasses);

router.get('/recent', authenticateToken, classController.getRecentClassesByUser);
// router.get('/', authenticateToken, classController.getRecentClassesByUser);

// קבלת כיתה לפי מזהה
router.get('/:id', classController.getClassById);

// קבלת  לפי מזהה
router.get('/:id/participants', classController.getParticipantsByClassId);
// עדכון פרטי כיתה
router.put('/:id', classController.updateClass);

router.post('/:classId/register', authenticateToken, classController.registerToClass);

// ביטול רישום לקורס
router.post('/:classId/unregister', authenticateToken, classController.unregisterFromClass);

// בדיקה אם המשתמש רשום לקורס
router.get('/:classId/isRegistered', authenticateToken, classController.isUserRegistered);

// מחיקת כיתה
router.delete('/:id', classController.deleteClass);

module.exports = router;