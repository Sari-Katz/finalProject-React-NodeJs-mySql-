const classService = require('../services/classService');

// יצירת כיתה חדשה
exports.createClass = async (req, res) => {
    try {
        const { title, class_types, day_of_week, start_time, end_time, date_start } = req.body;

    // בדיקות בסיסיות
    if (!title || !class_types || !day_of_week || !start_time || !end_time || !date_start) {
      return res.status(400).json({ message: "יש למלא את כל השדות" });
    }

    // בדיקת שעת התחלה < שעת סיום
    if (start_time >= end_time) {
      return res.status(400).json({ message: "שעת ההתחלה חייבת להיות לפני שעת הסיום" });
    }

    // בדיקה שיום בשבוע תקין
    const validDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    if (!validDays.includes(day_of_week)) {
      return res.status(400).json({ message: "יום בשבוע לא תקין" });
    }

    const newClass = await classService.createClass({ title, class_types, day_of_week, start_time, end_time, date_start });
     console.log(newClass)

        res.status(201).json(newClass);
    } catch (error) {
      console.log(error)
        res.status(500).json({ message: 'שגיאה ביצירת כיתה', error: error.message });
    }
};

// קבלת כל הכיתות (עם אפשרות לסינון)
exports.getClasses = async (req, res) => {
 try {
  let classes;
    const { week, ...otherFilters } = req.query;
    let filters = { ...otherFilters };
  console.log(week);

    if (week) {
      const weekFilter = addWeekFilter({ week });
      classes =classService.getClassesByWeek(weekFilter);
        console.log(weekFilter);

    }
    else{
        classes = Object.keys(filters).length === 0
            ? await classService.getAllClasses()
            : await classService.searchClasses(filters);
     }
    res.status(200).json(classes);
  } catch (error) {
    console.log(error)
        res.status(500).json({ message: 'שגיאה בקבלת כיתות', error: error.message });
    }
};

// פונקציה פנימית לבניית פילטר שבועי לפי פרמטר week
function addWeekFilter(query) {
  const inputDate = new Date(query.week);
  if (isNaN(inputDate)) return {}; // תאריך לא תקין – לא מוסיף פילטר

  const dayOfWeek = inputDate.getDay(); // 0 = Sunday
  const diffToSunday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(inputDate);
  startOfWeek.setDate(inputDate.getDate() - diffToSunday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    classDate: {
     gte: startOfWeek.toISOString().slice(0, 10), // "2025-06-08"
    lte: endOfWeek.toISOString().slice(0, 10)    // "2025-06-14"
    }
  };
}

exports.getRecentClassesByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'חסר userId' });
    }

    const classes = await classService.getRecentClassesByUser(userId);
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בקבלת קורסים מהחודש האחרון', error: error.message });
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