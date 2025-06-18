const classService = require('../services/classService');
const userService = require('../services/userService');
const mailer = require('../utils/mailer');

// יצירת כיתה חדשה
exports.createClass = async (req, res) => {
  try {
    const { title, class_types, start_time, end_time, date_start } = req.body;

    // בדיקות בסיסיות
    if (!title || !class_types || !start_time || !end_time || !date_start) {
      return res.status(400).json({ message: "יש למלא את כל השדות" });
    }

    // בדיקת שעת התחלה < שעת סיום
    if (start_time >= end_time) {
      return res.status(400).json({ message: "שעת ההתחלה חייבת להיות לפני שעת הסיום" });
    }

    // הפקת היום בשבוע מתוך date_start
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const dateObj = new Date(date_start);
    if (isNaN(dateObj)) {
      return res.status(400).json({ message: "תאריך לא תקין" });
    }
    const day_of_week = days[dateObj.getDay()];

    const newClass = await classService.createClass({
      title,
      class_types,
      day_of_week,
      start_time,
      end_time,
      date_start
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'שגיאה ביצירת כיתה', error: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    let classes;
    const { week, ...otherFilters } = req.query;
    let filters = { ...otherFilters };

    console.log(filters)
    classes = Object.keys(filters).length === 0
      ? await classService.getAllClasses()
      : await classService.searchClasses(filters);
    console.log(classes)

    res.status(200).json(classes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'שגיאה בקבלת כיתות', error: error.message });
  }
};

// פונקציה  לשליפת כיתות לפי שבוע
exports.getClassesByWeekInternal = async (req, res) => {
  try {
    const { currentDate } = req.params;
    if (!currentDate) {
      return res.status(400).json({ message: 'יש לספק תאריך' });
    }
    const weekFilter = addWeekFilter({ week: currentDate });
    const classes = await classService.getClassesByWeek(weekFilter);
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error getting classes by week (internal):', error);
    res.status(500).json({ message: 'שגיאה בקבלת כיתות לפי שבוע', error: error.message });
  }
};

// קבלת כיתה לפי ID
exports.getClassById = async (req, res) => {
  try {
    const classItem = await classService.getClassById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
    }
    res.json(classItem);
  } catch (error) {
    console.error('Error getting class by ID:', error);
    res.status(500).json({ message: 'שגיאה בקבלת כיתה', error: error.message });
  }
};

// קבלת כיתה עם פרטי משתתפים
exports.getClassWithParticipants = async (req, res) => {
  try {
    const classWithParticipants = await classService.getClassWithParticipants(req.params.id);
    if (!classWithParticipants) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
    }
    res.json(classWithParticipants);
  } catch (error) {
    console.error('Error getting class with participants:', error);
    res.status(500).json({ message: 'שגיאה בקבלת כיתה עם משתתפים', error: error.message });
  }
};

// קבלת משתתפים לפי ID של כיתה
exports.getParticipantsByClassId = async (req, res) => {
  try {
    const classId = req.params.id;
    const participants = await classService.getParticipantsByClassId(classId);
    res.json(participants);
  } catch (error) {
    console.error("שגיאה בקבלת משתתפים:", error);
    res.status(500).json({ error: "שגיאה בקבלת משתתפים" });
  }
};

// קבלת כיתות אחרונות של משתמש
exports.getRecentClassesByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'חסר userId' });
    }

    const classes = await classService.getRecentClassesByUser(userId);
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error getting recent classes:', error);
    res.status(500).json({ message: 'שגיאה בקבלת קורסים מהחודש האחרון', error: error.message });
  }
};

// עדכון כיתה
exports.updateClass = async (req, res) => {
  try {
    const { title, class_types, day_of_week, start_time, end_time, date_start } = req.body;

    // בדיקות בסיסיות (אופציונלי - רק אם השדה קיים)
    if (start_time && end_time && start_time >= end_time) {
      return res.status(400).json({ message: "שעת ההתחלה חייבת להיות לפני שעת הסיום" });
    }

    if (day_of_week) {
      const validDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "מוצאי שבת"];
      if (!validDays.includes(day_of_week)) {
        return res.status(400).json({ message: "יום בשבוע לא תקין" });
      }
    }

    const updatedClass = await classService.updateClass(req.params.id, req.body);
    if (!updatedClass) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
    }
    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'שגיאה בעדכון כיתה', error: error.message });
  }
};

// מחיקת כיתה
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const notify = req.query.notify === true || req.query.notify === 'true';

    if (notify) {
      // שלח התראות למשתתפים לפני המחיקה
      const userIds = await classService.getParticipantUserIds(classId);

      if (userIds.length > 0) {
        const emails = await userService.getEmailsByUserIds(userIds);
        await mailer.sendCancellationEmails(emails, classId);
      }
    }

    const deleted = await classService.deleteClassAndParticipants(classId);

    if (!deleted) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
    }

    res.json({
      message: 'הכיתה נמחקה בהצלחה.',
      notificationsSent: notify
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'שגיאה במחיקת כיתה', error: error.message });
  }
};

// רישום משתמש לכיתה
exports.registerUserToClass = async (req, res) => {
  try {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
      return res.status(400).json({ message: 'חסרים פרטי משתמש או כיתה' });
    }

    // בדוק אם הכיתה קיימת
    const classExists = await classService.getClassById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה' });
    }

    // בדוק אם המשתמש כבר רשום
    const isRegistered = await classService.isUserRegisteredToClass(userId, classId);
    if (isRegistered) {
      return res.status(409).json({ message: 'המשתמש כבר רשום לכיתה זו' });
    }

    await classService.registerUserToClass(userId, classId);
    res.json({ message: 'המשתמש נרשם בהצלחה לכיתה' });
  } catch (error) {
    console.error('Error registering user to class:', error);
    res.status(500).json({ message: 'שגיאה ברישום משתמש לכיתה', error: error.message });
  }
};

// ביטול רישום משתמש מכיתה
exports.unregisterUserFromClass = async (req, res) => {
  try {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
      return res.status(400).json({ message: 'חסרים פרטי משתמש או כיתה' });
    }

    await classService.unregisterUserFromClass(userId, classId);
    res.json({ message: 'הרישום לכיתה בוטל בהצלחה' });
  } catch (error) {
    console.error('Error unregistering user from class:', error);
    res.status(500).json({ message: 'שגיאה בביטול רישום משתמש מכיתה', error: error.message });
  }
};

// קבלת סטטיסטיקות כיתה
exports.getClassStatistics = async (req, res) => {
  try {
    const classId = req.params.id;
    const statistics = await classService.getClassStatistics(classId);
    res.json(statistics);
  } catch (error) {
    console.error('Error getting class statistics:', error);
    res.status(500).json({ message: 'שגיאה בקבלת סטטיסטיקות כיתה', error: error.message });
  }
};

// פונקציה פנימית לבניית פילטר שבועי
function addWeekFilter(query) {
  const inputDate = new Date(query.week);
  if (isNaN(inputDate)) return {}; 
  const dayOfWeek = inputDate.getDay(); 
  const diffToSunday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(inputDate);
  startOfWeek.setDate(inputDate.getDate() - diffToSunday);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return {
    classDate: {
      gte: startOfWeek.toISOString().slice(0, 10),
      lte: endOfWeek.toISOString().slice(0, 10)
    }
  };
}