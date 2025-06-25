const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = Object.keys(filters).length === 0
      ? await userService.getAllUsers()
      : await userService.searchUsers(filters);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
    try {
        const { full_name, password, email, phone } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים, אות גדולה, אות קטנה ומספר.' });
        }
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message:'אין אפשרות רישום עם פרטים אלו' });
        }
        const newUser = await userService.createUser({ full_name, password, email, phone });
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};

exports.checkSession = (req, res) => {
  const { id, full_name,email,role } = req.user;
  res.json({ id, full_name,email,role } );
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  return res.status(200).json({ message: "Logout successful" });
};

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
      { id: user.id, role: user.role , email:user.email, full_name:user.full_name},
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 3 
    });
    const { password_hash, ...safeUser } = user;
    return res.json({ message: 'התחברת בהצלחה', user: safeUser });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
};

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

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error get user:', error);
        res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await userService.update(req.user.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

