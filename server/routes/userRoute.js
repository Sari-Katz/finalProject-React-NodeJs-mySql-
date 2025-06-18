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
router.get('/me', authenticateToken, userController.getUserById);

// // עדכון פרטי משתמש
router.put('/me', authenticateToken,userController.updateUser);
// // מחיקת משתמש
// router.delete('/:id', userController.deleteUser);
router.get('/:id/dashboard', authenticateToken,userController.getUserDashboard);


module.exports = router;