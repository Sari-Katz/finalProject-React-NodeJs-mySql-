// const pool = require('../../DB/Connection');

// const classService = {
//     // יצירת כיתה חדשה
//     async createClass({ title, class_types, day_of_week, start_time, date_start, end_time }) {
//         const conn = await pool.getConnection();
//         try {
//             await conn.beginTransaction();

//             const [result] = await conn.query(
//                 'INSERT INTO classes (title, class_types, day_of_week, start_time, date_start, end_time) VALUES (?, ?, ?, ?, ?, ?)',
//                 [title, class_types, day_of_week, start_time, date_start, end_time]
//             );
//             const classId = result.insertId;

//             await conn.commit();
//             return { id: classId, title, class_types, day_of_week, start_time, date_start, end_time };
//         } catch (err) {
//             await conn.rollback();
//             throw err;
//         } finally {
//             conn.release();
//         }
//     },

//     // קבלת כל הכיתות
//     async getAllClasses() {
//         const [rows] = await pool.query(
//             'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes'
//         );
//         return rows;
//     },

//   // classService.js
// async searchClasses(filters) {
//     let query = `
//         SELECT id, title, class_types, day_of_week, start_time, date_start, end_time
//         FROM classes
//         WHERE 1=1
//     `;
//     const params = [];

//     // חילוץ פרמטרים מיוחדים
//     const { search, limit, offset, ...otherFilters } = filters;

//     // חיפוש כללי לפי כותרת, אם יש search
//     if (search) {
//         query += ' AND title LIKE ?';
//         params.push(`%${search}%`);
//     }

//     // פילטרים רגילים לפי עמודות אחרות
//     for (const [key, value] of Object.entries(otherFilters)) {
//         query += ` AND ${key} = ?`;
//         params.push(value);
//     }

//     // הוספת limit ו-offset אם קיימים
//     if (limit) {
//         query += ' LIMIT ?';
//         params.push(Number(limit));
//     }
//     if (offset) {
//         query += ' OFFSET ?';
//         params.push(Number(offset));
//     }

//     const [rows] = await pool.query(query, params);
//     return rows;
// },

//     async getRecentClassesByUser(userId) {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//   const isoDate = oneMonthAgo.toISOString().split('T')[0];

//   const query = `
//     SELECT c.id, c.title, c.class_types, c.day_of_week, c.start_time, c.date_start, c.end_time
//     FROM classes c
//     JOIN classes_participants cp ON c.id = cp.class_id
//     WHERE cp.user_id = ? AND c.date_start >= ?
//   `;

//   const [rows] = await pool.query(query, [userId, isoDate]);
//   return rows;
// },
// async getClassesByWeek(weekFilter){
//     const { gte, lte } = weekFilter.classDate;
//     const [rows] = await pool.query(
//             'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE  date_start >=? AND date_start <=?',
//             [gte,lte]
//         );
//         return rows;

// },

//     // קבלת כיתה לפי מזהה
//     async getClassById(id) {
//         const [rows] = await pool.query(
//             'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE id = ?',
//             [id]
//         );
//         return rows[0];
//     },

//     // עדכון פרטי כיתה
//     async updateClass(id, { title, class_types, day_of_week, start_time, date_start, end_time }) {
//         const [result] = await pool.query(
//             'UPDATE classes SET title = ?, class_types = ?, day_of_week = ?, start_time = ?, date_start = ?, end_time = ? WHERE id = ?',
//             [title, class_types, day_of_week, start_time, date_start, end_time, id]
//         );
//         if (result.affectedRows === 0) return null;
//         return { id, title, class_types, day_of_week, start_time, date_start, end_time };
//     },

//     // מחיקת כיתה
//   async deleteClassAndParticipants(classId) {
//   // מחק קודם את המשתתפים
//   await pool.query(
//     'DELETE FROM classes_participants WHERE class_id = ?',
//     [classId]
//   );

//   // אחר כך מחק את הכיתה עצמה
//   const [result] = await pool.query(
//     'DELETE FROM classes WHERE id = ?',
//     [classId]
//   );

//   return result.affectedRows > 0;
// },
//     // קבלת משתתפים לפי מזהה שיעור
// async getParticipantsByClassId(classId) {
//     const [rows] = await pool.query(
//         `SELECT user_id, class_id, status 
//          FROM classes_participants 
//          WHERE class_id = ?`,
//         [classId]
//     );
//     return rows;
// }
// };

// module.exports = classService;
const pool = require('../../DB/Connection');
const classService = {
    // יצירת כיתה חדשה
    async createClass({ title, class_types, start_time, date_start, end_time }) {
        // חישוב היום בשבוע מתוך date_start (0=Sunday, 6=Saturday)
        const dayOfWeek = new Date(date_start).getDay();

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.query(
                'INSERT INTO classes (title, class_types, day_of_week, start_time, date_start, end_time) VALUES (?, ?, ?, ?, ?, ?)',
                [title, class_types, dayOfWeek, start_time, date_start, end_time]
            );
            const classId = result.insertId;

            await conn.commit();
            return { id: classId, title, class_types, day_of_week: dayOfWeek, start_time, date_start, end_time };
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
            'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes ORDER BY date_start DESC'
        );
        return rows;
    },

    // חיפוש כיתות עם פילטרים
    async searchClasses(filters) {
        let query = `
            SELECT id, title, class_types, day_of_week, start_time, date_start, end_time
            FROM classes
            WHERE 1=1
        `;
        const params = [];

        // חילוץ פרמטרים מיוחדים
        const { search, limit, offset, ...otherFilters } = filters;

        // חיפוש כללי לפי כותרת
        if (search) {
            query += ' AND title LIKE ?';
            params.push(`%${search}%`);
        }

        // פילטרים רגילים לפי עמודות
        for (const [key, value] of Object.entries(otherFilters)) {
            if (value !== undefined && value !== null && value !== '') {
                query += ` AND ${key} = ?`;
                params.push(value);
            }
        }

        // מיון
        query += ' ORDER BY date_start DESC';

        // הוספת limit ו-offset
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

    // קבלת כיתות לפי שבוע
    async getClassesByWeek(weekFilter) {
        const { gte, lte } = weekFilter.classDate;
        const [rows] = await pool.query(
            'SELECT id, title, class_types, day_of_week, start_time, date_start, end_time FROM classes WHERE date_start >= ? AND date_start <= ? ORDER BY date_start ASC',
            [gte, lte]
        );
        return rows;
    },

    // קבלת כיתות אחרונות של משתמש (חודש אחרון)
    async getRecentClassesByUser(userId) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const isoDate = oneMonthAgo.toISOString().split('T')[0];

        const query = `
            SELECT c.id, c.title, c.class_types, c.day_of_week, c.start_time, c.date_start, c.end_time
            FROM classes c
            JOIN classes_participants cp ON c.id = cp.class_id
            WHERE cp.user_id = ? AND c.date_start >= ? AND cp.status = 'נרשמה'
            ORDER BY c.date_start DESC
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

    // קבלת כיתה עם פרטי משתתפים
    async getClassWithParticipants(classId) {
        const classQuery = `
            SELECT id, title, class_types, day_of_week, start_time, date_start, end_time 
            FROM classes 
            WHERE id = ?
        `;
        const [classRows] = await pool.query(classQuery, [classId]);
        
        if (classRows.length === 0) {
            return null;
        }

        const participantsQuery = `
            SELECT 
                u.id as user_id, 
                u.full_name, 
                u.email, 
                u.phone,
                cp.status
            FROM classes_participants cp
            JOIN users u ON cp.user_id = u.id
            WHERE cp.class_id = ?
        `;
        const [participantRows] = await pool.query(participantsQuery, [classId]);

        return {
            ...classRows[0],
            participants: participantRows,
            participants_count: participantRows.length
        };
    },

    // קבלת משתתפים לפי מזהה שיעור (עם פרטי משתמשים)
    async getParticipantsByClassId(classId) {
        const query = `
            SELECT 
                cp.user_id, 
                cp.class_id, 
                cp.status,
                u.full_name,
                u.email,
                u.phone
            FROM classes_participants cp
            JOIN users u ON cp.user_id = u.id
            WHERE cp.class_id = ?
        `;
        const [rows] = await pool.query(query, [classId]);
        return rows;
    },

    // קבלת רק IDs של משתתפים (למקרים שצריך רק את הרשימה)
    async getParticipantUserIds(classId) {
        const [rows] = await pool.query(
            'SELECT user_id FROM classes_participants WHERE class_id = ? AND status = "נרשמה"',
            [classId]
        );
        return rows.map(row => row.user_id);
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

    // מחיקת כיתה וכל המשתתפים שלה
    async deleteClassAndParticipants(classId) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // מחק קודם את המשתתפים
            await conn.query('DELETE FROM classes_participants WHERE class_id = ?', [classId]);

            // אחר כך מחק את הכיתה עצמה
            const [result] = await conn.query('DELETE FROM classes WHERE id = ?', [classId]);

            await conn.commit();
            return result.affectedRows > 0;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // בדיקה אם משתמש רשום לכיתה
    async isUserRegisteredToClass(userId, classId) {
        const [result] = await pool.query(
            'SELECT * FROM classes_participants WHERE user_id = ? AND class_id = ? AND status = "נרשמה"',
            [userId, classId]
        );
        return result.length > 0;
    },

    // רישום משתמש לכיתה
    async registerUserToClass(userId, classId) {
        const [existing] = await pool.query(
            'SELECT * FROM classes_participants WHERE user_id = ? AND class_id = ?',
            [userId, classId]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE classes_participants SET status = "נרשמה" WHERE user_id = ? AND class_id = ?',
                [userId, classId]
            );
        } else {
            await pool.query(
                'INSERT INTO classes_participants (user_id, class_id, status) VALUES (?, ?, "נרשמה")',
                [userId, classId]
            );
        }
    },

    // ביטול רישום משתמש מכיתה
    async unregisterUserFromClass(userId, classId) {
        await pool.query(
            'UPDATE classes_participants SET status = "בוטלה" WHERE user_id = ? AND class_id = ?',
            [userId, classId]
        );
    },

    // קבלת סטטיסטיקות של כיתה
    async getClassStatistics(classId) {
        const query = `
            SELECT 
                COUNT(*) as total_participants,
                SUM(CASE WHEN status = 'נרשמה' THEN 1 ELSE 0 END) as active_participants,
                SUM(CASE WHEN status = 'בוטלה' THEN 1 ELSE 0 END) as cancelled_participants
            FROM classes_participants 
            WHERE class_id = ?
        `;
        const [rows] = await pool.query(query, [classId]);
        return rows[0];
    }
};

module.exports = classService;