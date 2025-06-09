const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

// יצירת כיתה חדשה
router.post('/create', classController.createClass);

// קבלת כל הכיתות (עם אפשרות לסינון)
router.get('/', classController.getClasses);

router.get('/recent', classController.getRecentClassesByUser);

// קבלת כיתה לפי מזהה
router.get('/:id', classController.getClassById);

// עדכון פרטי כיתה
router.put('/:id', classController.updateClass);


// מחיקת כיתה
router.delete('/:id', classController.deleteClass);

module.exports = router;