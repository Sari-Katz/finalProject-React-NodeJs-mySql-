const pool = require('../../DB/Connection');
const bcrypt = require('bcrypt');

const userService = {
    // יצירת משתמש חדש
    async createUser({ full_name, email, phone, password }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // הכנסת משתמש לטבלת users
            const [userResult] = await conn.query(
                'INSERT INTO users (full_name, email, phone) VALUES (?, ?, ?)',
                [full_name, email, phone]
            );
            const userId = userResult.insertId;

            // הצפנת סיסמה והכנסה לטבלת user_credentials
            const password_hash = await bcrypt.hash(password, 10);
            await conn.query(
                'INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)',
                [userId, password_hash]
            );

            await conn.commit();
            return { id: userId, full_name, email, phone };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // קבלת משתמש לפי אימייל (כולל סיסמה מוצפנת)
    async getUserByEmail(email) {
        const [rows] = await pool.query(
            `SELECT u.*, uc.password_hash
             FROM users u
             JOIN user_credentials uc ON u.id = uc.user_id
             WHERE u.email = ?`,
            [email]
        );
        return rows[0];
    },

    // קבלת משתמש לפי מזהה (בלי סיסמה)
    async getUserById(id) {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // קבלת כל המשתמשים (בלי סיסמאות)
    async getAllUsers() {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone, created_at FROM users'
        );
        return rows;
    },

    // חיפוש משתמשים עם פילטרים (בלי סיסמאות)
    async searchUsers(filters) {
        let query = 'SELECT id, full_name, email, phone, created_at FROM users WHERE 1=1';
        const params = [];

        for (const [key, value] of Object.entries(filters)) {
            query += ` AND ${key} = ?`;
            params.push(value);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    }
};

module.exports = userService;