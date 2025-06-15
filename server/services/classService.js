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

  // classService.js
async searchClasses(filters) {
    let query = `
        SELECT id, title, class_types, day_of_week, start_time, date_start, end_time
        FROM classes
        WHERE 1=1
    `;
    const params = [];

    // חילוץ פרמטרים מיוחדים
    const { search, limit, offset, ...otherFilters } = filters;

    // חיפוש כללי לפי כותרת, אם יש search
    if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
    }

    // פילטרים רגילים לפי עמודות אחרות
    for (const [key, value] of Object.entries(otherFilters)) {
        query += ` AND ${key} = ?`;
        params.push(value);
    }

    // הוספת limit ו-offset אם קיימים
    if (limit) {
        query += ' LIMIT ?';
        params.push(Number(limit));
    }
    if (offset) {
        query += ' OFFSET ?';
        params.push(Number(offset));
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
async getClassesByWeek(weekFilter){
    const { gte, lte } = weekFilter.classDate;
    const [rows] = await pool.query(
            'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE  date_start >=? AND date_start <=?',
            [gte,lte]
        );
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
  async deleteClassAndParticipants(classId) {
  // מחק קודם את המשתתפים
  await pool.query(
    'DELETE FROM classes_participants WHERE class_id = ?',
    [classId]
  );

  // אחר כך מחק את הכיתה עצמה
  const [result] = await pool.query(
    'DELETE FROM classes WHERE id = ?',
    [classId]
  );

  return result.affectedRows > 0;
},
    // קבלת משתתפים לפי מזהה שיעור
async getParticipantsByClassId(classId) {
    const [rows] = await pool.query(
        `SELECT user_id, class_id, status 
         FROM classes_participants 
         WHERE class_id = ?`,
        [classId]
    );
    return rows;
}
};

module.exports = classService;