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

try {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );
  console.log("Token:", token);
  res.json({ message: 'התחברת בהצלחה', user, token });
} catch (err) {
  console.error("JWT Error:", err);
  return res.status(500).json({ message: 'שגיאה ביצירת טוקן', error: err.message });
}

// שליחת תגובה עם טוקן

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'אימייל או סיסמה שגויים.' });
        }
res.json({
  message: 'התחברת בהצלחה',
  user,
  token
});
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
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