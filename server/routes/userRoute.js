const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// הרשמה של משתמש חדש
router.post('/register', userController.registerUser);

// התחברות משתמש
router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

router.get("/check-session", authenticateToken, userController.checkSession);
// קבלת כל המשתמשים (עם אפשרות לסינון)
router.get('/', authenticateToken, requireRole('admin'), userController.getUsers);

// קבלת משתמש לפי מזהה
router.get('/me', userController.getUserById);

// // עדכון פרטי משתמש
router.put('/:id', userController.updateUser);
// // מחיקת משתמש
router.delete('/:id', userController.deleteUser);

// בדיקה האם המשתמש השלים את אתגר השבוע
// router.get('/:id/challenges/current/completed', controller.didUserCompleteCurrentChallenge);

router.get('/:id/dashboard', userController.getUserDashboard);

router.post('/classes_participants/:classId/register', authenticateToken, userController.registerToClass);

// ביטול רישום לקורס
router.post('/classes_participants/:classId/unregister', authenticateToken, userController.unregisterFromClass);

// בדיקה אם המשתמש רשום לקורס
router.get('/classes_participants/:classId/isRegistered', authenticateToken, userController.isUserRegistered);

module.exports = router;