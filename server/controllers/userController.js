const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// קבלת כל המשתמשים או חיפוש עם פילטרים
exports.getUsers = async (req, res) => {
  try {
    console.log("req.query", req.query);
    const filters = req.query;
    const users = Object.keys(filters).length === 0
      ? await userService.getAllUsers()
      : await userService.searchUsers(filters);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// הרשמת משתמש חדש
exports.registerUser = async (req, res) => {
    try {
        const { full_name, password, email, phone } = req.body;
        // בדיקת סיסמה: לפחות 6 תווים, אות גדולה, אות קטנה, מספר
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר.' });
        }
        // בדיקה אם המשתמש כבר קיים לפי אימייל
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'אימייל זה כבר קיים.' });
        }
        // יצירת משתמש חדש
        const newUser = await userService.createUser({ full_name, password, email, phone });
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};

// התחברות משתמש
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role ,email:user.email,full_name:user.full_name},
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    // שליחת העוגייה המאובטחת
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true בשרת בפרודקשן
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 3 // 3 שעות
    });

    // נשלח את פרטי המשתמש בלי סיסמה ובלי הטוקן
    const { password_hash, ...safeUser } = user;
    return res.json({ message: 'התחברת בהצלחה', user: safeUser });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
};

// עבור משתמש פרטי
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;
    const dashboardData = await userService.getUserDashboard(userId);
    res.status(201).json(dashboardData);
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
// עבור משתמש פרטי

exports.completeWeeklyChallenge = async (req, res) => {
const userId = req.params.id;
  const challengeId = req.params.weeklyChallenge;
    const { completed } = req.body;  // מקבל את הערך שמגיע מהקליינט
console.log(completed);
  try {
    await userService.markChallengeCompletion(userId, challengeId,completed);
    res.status(200).json({
      message: 'Challenge completion status updated successfully'
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ message: 'שגיאה בעת סימון אתגר כושלם' });
  }
};

// קבלת משתמש לפי מזהה
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};
exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.registerToClass = async (req, res) => {
  const userId = req.user.id;
  const classId = req.params.classId;
  console.log(userId);
  try {
    await userService.registerUserToClass(userId, classId);
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
    await userService.unregisterUserFromClass(userId, classId);
    res.status(200).json({ message: 'הרישום בוטל בהצלחה' });
  } catch (error) {
    console.error('שגיאה בביטול הרשמה:', error);
    res.status(500).json({ message: 'שגיאה בביטול הרשמה' });
  }
};
exports.logoutUser = (req, res) => {
  // בצד שרת, אם אנחנו משתמשים ב־HTTP-only cookies, פשוט שולחים תגובה שמוחקת את העוגייה
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  return res.status(200).json({ message: "Logout successful" });
};
exports.checkSession = (req, res) => {
console.log(req.user)
  const { id, full_name,email,role } = req.user;

  res.json({ id, full_name,email,role } ); // שליחת פרטי המשתמש
};

exports.isUserRegistered = async (req, res) => {

  const userId = req.user.id;
  const classId = req.params.classId;
  try {
    const isRegistered = await userService.isUserRegisteredToClass(userId, classId);
    res.status(200).json(isRegistered );
  } catch (error) {
    console.error('שגיאה בבדיקת רישום:', error);
    res.status(500).json({ message: 'שגיאה בבדיקת רישום' });
  }
};
