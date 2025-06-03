const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// דוגמה לראוטים על סמך קונטרולר

// הרשמה של משתמש חדש
router.post('/register', userController.registerUser);

// התחברות משתמש
router.post('/login', userController.loginUser);
// קבלת כל המשתמשים (למנהל)
router.get('/', userController.getUsers);

// קבלת משתמש לפי מזהה
router.get('/:id', userController.getUserById);

// // עדכון פרטי משתמש
// router.put('/:id', userController.updateUser);

// // מחיקת משתמש
// router.delete('/:id', userController.deleteUser);

// // בדיקת טוקן (למשל לאימות התחברות)
// router.post('/verify-token', userController.verifyToken);
module.exports = router;