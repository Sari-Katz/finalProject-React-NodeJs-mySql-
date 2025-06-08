const express = require('express');
const classController = require('../controllers/Controller');

const router = express.Router();

router.post('/create', classController.createClass);

router.get('/', classController.getClasses);

router.get('/:id', classController.getClassById);
 router.put('/:id', classController.updateClass);


// מחיקת כיתה
router.delete('/:id', classController.deleteClass);

module.exports = router;