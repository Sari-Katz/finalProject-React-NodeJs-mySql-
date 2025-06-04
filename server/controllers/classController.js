const classService = require('../services/classService');

// יצירת כיתה חדשה
exports.createClass = async (req, res) => {
    try {
        const classData = req.body;
        const newClass = await classService.createClass(classData);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה ביצירת כיתה', error: error.message });
    }
};

// קבלת כל הכיתות (עם אפשרות לסינון)
exports.getClasses = async (req, res) => {
    try {
        const filters = req.query;
        const classes = Object.keys(filters).length === 0
            ? await classService.getAllClasses()
            : await classService.searchClasses(filters);

        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת כיתות', error: error.message });
    }
};

// קבלת כיתה לפי מזהה
exports.getClassById = async (req, res) => {
    try {
        const classItem = await classService.getClassById(req.params.id);
        if (!classItem) {
            return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
        }
        res.json(classItem);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת כיתה', error: error.message });
    }
};

// עדכון פרטי כיתה
exports.updateClass = async (req, res) => {
    try {
        const updatedClass = await classService.updateClass(req.params.id, req.body);
        if (!updatedClass) {
            return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
        }
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בעדכון כיתה', error: error.message });
    }
};

// מחיקת כיתה
exports.deleteClass = async (req, res) => {
    try {
        const deleted = await classService.deleteClass(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
        }
        res.json({ message: 'הכיתה נמחקה בהצלחה.' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת כיתה', error: error.message });
    }
};