const pool = require('../../DB/Connection');

const classService = {
    // יצירת כיתה חדשה
    async createClass({ name, grade, teacher_id }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.query(
                'INSERT INTO classes (name, grade, teacher_id) VALUES (?, ?, ?)',
                [name, grade, teacher_id]
            );
            const classId = result.insertId;

            await conn.commit();
            return { id: classId, name, grade, teacher_id };
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
            'SELECT id, name, grade, teacher_id FROM classes'
        );
        return rows;
    },

    // חיפוש כיתות עם פילטרים
    async searchClasses(filters) {
        let query = 'SELECT id, name, grade, teacher_id FROM classes WHERE 1=1';
        const params = [];

        for (const [key, value] of Object.entries(filters)) {
            query += ` AND ${key} = ?`;
            params.push(value);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    // קבלת כיתה לפי מזהה
    async getClassById(id) {
        const [rows] = await pool.query(
            'SELECT id, name, grade, teacher_id FROM classes WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // עדכון פרטי כיתה
    async updateClass(id, { name, grade, teacher_id }) {
        const [result] = await pool.query(
            'UPDATE classes SET name = ?, grade = ?, teacher_id = ? WHERE id = ?',
            [name, grade, teacher_id, id]
        );
        if (result.affectedRows === 0) return null;
        return { id, name, grade, teacher_id };
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