const classService = require('../services/classService');
const userService = require('../services/userService');
const mailer = require('../utils/mailer'); // תראה הסבר בהמשך

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
       classes = await classService.getClassesByWeek(weekFilter);
        console.log(weekFilter);
        console.log(classes)

    }
    else{
      console.log(filters)
        classes = Object.keys(filters).length === 0
            ? await classService.getAllClasses()
            : await classService.searchClasses(filters);
                   console.log(classes)
 
     }
    res.status(200).json(classes);
  } catch (error) {
    console.log(error)
        res.status(500).json({ message: 'שגיאה בקבלת כיתות', error: error.message });
    }
};
exports.getParticipantsByClassId = async (req, res) =>{
   const classId = req.params.id;
  try {
    const participants = await classService.getParticipantsByClassId(classId);
    const userIds = participants.map((p) => p.user_id);
    const users = await userService.getUsersByIds(userIds);

    // מיזוג לפי user_id
    const usersMap = Object.fromEntries(users.map(u => [u.id, u]));
    const enriched = participants.map(p => ({
      ...usersMap[p.user_id],
      status: p.status
    }));

    res.json(enriched);
  } catch (err) {
    console.error("שגיאה:", err);
    res.status(500).json({ error: "שגיאה בקבלת משתתפים" });
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
     gte: startOfWeek.toISOString().slice(0, 10), 
    lte: endOfWeek.toISOString().slice(0, 10)  
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
exports.registerToClass = async (req, res) => {
  const userId = req.user.id;
  const classId = req.params.classId;
  console.log(userId);
  try {
    await classService.registerUserToClass(userId, classId);
    res.status(200).json({ message: 'נרשמת בהצלחה לשיעור' });
  } catch (error) {
    console.error('שגיאה בהרשמה:', error);
    res.status(500).json({ message: 'שגיאה בהרשמה' });
  }
};

exports.unregisterFromClass = async (req, res) => {
  const userId = req.user.id;
  const classId = req.params.classId;

  try {
    await classService.unregisterUserFromClass(userId, classId);
    res.status(200).json({ message: 'הרישום בוטל בהצלחה' });
  } catch (error) {
    console.error('שגיאה בביטול הרשמה:', error);
    res.status(500).json({ message: 'שגיאה בביטול הרשמה' });
  }
};

exports.isUserRegistered = async (req, res) => {

  const userId = req.user.id;
  const classId = req.params.classId;
  try {
    const isRegistered = await classService.isUserRegisteredToClass(userId, classId);
    res.status(200).json(isRegistered );
  } catch (error) {
    console.error('שגיאה בבדיקת רישום:', error);
    res.status(500).json({ message: 'שגיאה בבדיקת רישום' });
  }
};
// מחיקת כיתה
exports.deleteClass = async (req, res) => {

   const classId = req.params.id;
  const notify = req.query.notify === true || req.query.notify  === 'true'; // בדיקה עבור בודיס שנשלחים מ-JSON או טופס
console.log(notify);

  try {
    if (notify) {
      // שלב 1: הבא את כל user_id של המשתתפים בכיתה
       const participants = await classService.getParticipantsByClassId(classId);

      const userIds = participants.map(p => p.user_id);
      if (userIds.length > 0) {
        // שלב 2: הבא את כתובות האימייל של המשתמשים
        const emails = await userService.getEmailsByUserIds(userIds);

        // שלב 3: שלח מיילים
        await mailer.sendCancellationEmails(emails, classId);
      }
    }

    const deleted = await classService.deleteClassAndParticipants(classId);

    if (!deleted) {
      return res.status(404).json({ message: 'הכיתה לא נמצאה.' });
    }

    res.json({ message: 'הכיתה נמחקה בהצלחה.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'שגיאה במחיקת כיתה', error: error.message });
  }
};