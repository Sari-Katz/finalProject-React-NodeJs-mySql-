const express = require('express');
const classController = require('../controllers/classController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, requireRole('admin'), classController.createClass);
router.get('/', authenticateToken,classController.getClasses);
router.get('/week/:currentDate', authenticateToken,classController.getClassesByWeekInternal);
router.get('/recent', authenticateToken, classController.getRecentClassesByUser);
router.get('/:id', classController.getClassById);
//קבלת משתתפים בכיתה לפי מזהה
router.get('/:id/participants', classController.getParticipantsByClassId);
router.put('/:id',authenticateToken, requireRole('admin'), classController.updateClass);
router.delete('/:id',authenticateToken, requireRole('admin'), classController.deleteClass);

module.exports = router;