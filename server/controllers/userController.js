const userService = require('../services/userService');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  try {
    
    const filters = req.query;
    console.log(`Filters received: ${JSON.stringify(filters)}`);
    logger.info(`Searching users in controllers with filters: ${JSON.stringify(filters)}`);
    const users = Object.keys(filters).length === 0
      ? await getAllUsersService()
      : await searchUsersService(filters);

    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error in handleUserSearch: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// הרשמת משתמש חדש
exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

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

        // הצפנת סיסמה
        const hashedPassword = await bcrypt.hash(password, 10);

        // יצירת משתמש חדש
        const newUser = await userService.createUser({ username, password: hashedPassword, email });
        res.status(201).json(newUser);
    } catch (error) {
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'אימייל או סיסמה שגויים.' });
        }

        // כאן אפשר להחזיר טוקן או פרטי משתמש
        res.json({ message: 'התחברת בהצלחה', user });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};

// // דוגמה לפונקציות נוספות בהתאם לסרביס
// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await userService.getAllUsers();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
//     }
// };

exports.getUserById = async (req, res) => {
    try {
        console.log("req.params.id", req.params.id);
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};