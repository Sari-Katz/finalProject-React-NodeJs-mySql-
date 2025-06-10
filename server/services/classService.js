const pool = require('../../DB/Connection');

const classService = {
    // יצירת כיתה חדשה
    async createClass({ title, class_types, day_of_week, start_time, date_start, end_time }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.query(
                'INSERT INTO classes (title, class_types, day_of_week, start_time, date_start, end_time) VALUES (?, ?, ?, ?, ?, ?)',
                [title, class_types, day_of_week, start_time, date_start, end_time]
            );
            const classId = result.insertId;

            await conn.commit();
            return { id: classId, title, class_types, day_of_week, start_time, date_start, end_time };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // קבלת כל הכיתות
    async getAllClasses() {
        const [rows] = await pool.query(
            'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes'
        );
        return rows;
    },

    // חיפוש כיתות עם פילטרים
    async searchClasses(filters) {
        let query = 'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE 1=1';
        const params = [];

        for (const [key, value] of Object.entries(filters)) {
            query += ` AND ${key} = ?`;
            params.push(value);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    async getRecentClassesByUser(userId) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const isoDate = oneMonthAgo.toISOString().split('T')[0];

  const query = `
    SELECT c.id, c.title, c.class_types, c.day_of_week, c.start_time, c.date_start, c.end_time
    FROM classes c
    JOIN classes_participants cp ON c.id = cp.class_id
    WHERE cp.user_id = ? AND c.date_start >= ?
  `;

  const [rows] = await pool.query(query, [userId, isoDate]);
  return rows;
},

    // קבלת כיתה לפי מזהה
    async getClassById(id) {
        const [rows] = await pool.query(
            'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // עדכון פרטי כיתה
    async updateClass(id, { title, class_types, day_of_week, start_time, date_start, end_time }) {
        const [result] = await pool.query(
            'UPDATE classes SET title = ?, class_types = ?, day_of_week = ?, start_time = ?, date_start = ?, end_time = ? WHERE id = ?',
            [title, class_types, day_of_week, start_time, date_start, end_time, id]
        );
        if (result.affectedRows === 0) return null;
        return { id, title, class_types, day_of_week, start_time, date_start, end_time };
    },

    // מחיקת כיתה
    async deleteClass(id) {
        const [result] = await pool.query(
            'DELETE FROM classes WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = classService;