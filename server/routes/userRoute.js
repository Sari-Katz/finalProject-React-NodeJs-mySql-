const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

router.get("/check-session", authenticateToken, userController.checkSession);
 
router.get('/', authenticateToken, requireRole('admin'), userController.getUsers);

router.get('/me', authenticateToken, userController.getUserById);

router.put('/me', authenticateToken,userController.updateUser);

router.get('/:id/dashboard', authenticateToken,userController.getUserDashboard);


module.exports = router;