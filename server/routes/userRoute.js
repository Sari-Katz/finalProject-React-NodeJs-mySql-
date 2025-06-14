const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// הרשמה של משתמש חדש
router.post('/register', userController.registerUser);

// התחברות משתמש
router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

// קבלת כל המשתמשים (עם אפשרות לסינון)
router.get('/', authenticateToken, requireRole('admin'), userController.getUsers);

// קבלת משתמש לפי מזהה
router.get('/:id', userController.getUserById);

// // עדכון פרטי משתמש
// router.put('/:id', userController.updateUser);

// // מחיקת משתמש
// router.delete('/:id', userController.deleteUser);

// // בדיקת טוקן (למשל לאימות התחברות)
// router.post('/verify-token', userController.verifyToken);
// בדיקה האם המשתמש השלים את אתגר השבוע
// router.get('/:id/challenges/current/completed', controller.didUserCompleteCurrentChallenge);
router.get('/:id/dashboard', userController.getUserDashboard);
router.patch('/:id/weekly-challenge/:weeklyChallenge/complete', userController.completeWeeklyChallenge);
router.post('/classes_participants/:classId/register', authenticateToken, userController.registerToClass);

// ביטול רישום לקורס
router.post('/classes_participants/:classId/unregister', authenticateToken, userController.unregisterFromClass);

// בדיקה אם המשתמש רשום לקורס
router.get('/classes_participants/:classId/isRegistered', authenticateToken, userController.isUserRegistered);
module.exports = router;