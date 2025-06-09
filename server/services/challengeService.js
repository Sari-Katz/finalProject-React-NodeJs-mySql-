// const pool = require('../../DB/Connection');

// const challengeService = {
//     // יצירת אתגר שבועי חדש
//     async createChallenge({ week_start_date, description }) {
//         const conn = await pool.getConnection();
//         try {
//             await conn.beginTransaction();

//             const [result] = await conn.query(
//                 'INSERT INTO weekly_challenges (week_start_date, description) VALUES (?, ?)',
//                 [week_start_date, description]
//             );
//             const challengeId = result.insertId;

//             await conn.commit();
//             return { id: challengeId, week_start_date, description };
//         } catch (err) {
//             await conn.rollback();
//             throw err;
//         } finally {
//             conn.release();
//         }
//     },

//     // קבלת כל האתגרים השבועיים
//     async getAllChallenges() {
//         const [rows] = await pool.query(
//             'SELECT id, week_start_date, description FROM weekly_challenges'
//         );
//         return rows;
//     },

//     // חיפוש אתגרים שבועיים עם פילטרים
//     async searchChallenges(filters) {
//         let query = 'SELECT user_id FROM challenge_completions WHERE 1=1';
//         const params = [];

//         for (const [key, value] of Object.entries(filters)) {
//             if (key === 'week_start_date' && typeof value === 'object' && value.$gte && value.$lte) {
//                 query += ' AND week_start_date BETWEEN ? AND ?';
//                 params.push(value.$gte, value.$lte);
//             } else {
//                 query += ` AND ${key} = ?`;
//                 params.push(value);
//             }
//         }

//         const [rows] = await pool.query(query, params);
//         return rows;
//     },

//     // קבלת אתגר שבועי לפי מזהה
//     async getChallengeById(id) {
//         const [rows] = await pool.query(
//             'SELECT id, week_start_date, description FROM weekly_challenges WHERE id = ?',
//             [id]
//         );
//         return rows[0];
//     },

//     // קבלת אתגרים שהמשתמש השלים (או לא השלים)
//     async getChallengesByUserId(user_id) {
//         const [rows] = await pool.query(
//             `SELECT wc.id, wc.week_start_date, wc.description, cc.completed
//              FROM weekly_challenges wc
//              LEFT JOIN challenge_completions cc ON wc.id = cc.challenge_id AND cc.user_id = ?
//             `,
//             [user_id]
//         );
//         return rows;
//     },

//     // עדכון פרטי אתגר שבועי
//     async updateChallenge(id, { week_start_date, description }) {
//         const [result] = await pool.query(
//             'UPDATE weekly_challenges SET week_start_date = ?, description = ? WHERE id = ?',
//             [week_start_date, description, id]
//         );
//         if (result.affectedRows === 0) return null;
//         return { id, week_start_date, description };
//     },

//     // מחיקת אתגר שבועי
//     async deleteChallenge(id) {
//         const [result] = await pool.query(
//             'DELETE FROM weekly_challenges WHERE id = ?',
//             [id]
//         );
//         return result.affectedRows > 0;
//     },

//     // סימון אתגר כהושלם ע"י משתמש
//     async completeChallenge(user_id, challenge_id, completed = true) {
//         const [result] = await pool.query(
//             `INSERT INTO challenge_completions (user_id, challenge_id, completed)
//              VALUES (?, ?, ?)
//              ON DUPLICATE KEY UPDATE completed = VALUES(completed)`,
//             [user_id, challenge_id, completed]
//         );
//         return result.affectedRows > 0;
//     }
// };

// module.exports = challengeService;
const pool = require('../../DB/Connection');

exports.getAllChallenges = async () => {
    const [rows] = await pool.query('SELECT * FROM weekly_challenges');
    return rows;
};

exports.createChallenge = async ({ week_start_date, description }) => {
    const [result] = await pool.query(
        'INSERT INTO weekly_challenges (week_start_date, description) VALUES (?, ?)',
        [week_start_date, description]
    );
    return { id: result.insertId, week_start_date, description };
};

exports.deleteChallenge = async (id) => {
    await pool.query('DELETE FROM weekly_challenges WHERE id = ?', [id]);
};

exports.getCompletedUsers = async (challengeId) => {
    const [rows] = await pool.query(
        `SELECT u.* FROM challenge_completions cc
         JOIN users u ON cc.user_id = u.id
         WHERE cc.challenge_id = ? AND cc.completed = true`,
        [challengeId]
    );
    return rows;
};

exports.getUserCompletedChallenges = async (userId) => {
    const [rows] = await pool.query(
        `SELECT c.*, cc.completed FROM weekly_challenges c
         LEFT JOIN challenge_completions cc
         ON c.id = cc.challenge_id AND cc.user_id = ?`,
        [userId]
    );
    return rows;
};

exports.getUserChallengesByStatus = async (userId, completed) => {
    const [rows] = await pool.query(
        `SELECT c.* FROM weekly_challenges c
         JOIN challenge_completions cc ON c.id = cc.challenge_id
         WHERE cc.user_id = ? AND cc.completed = ?`,
        [userId, completed === 'true']
    );
    return rows;
};
exports.getRecentCompletedChallenges = async (userId, limit = 10) => {
    const [rows] = await pool.query(
        `SELECT c.*
         FROM weekly_challenges c
         JOIN challenge_completions cc ON c.id = cc.challenge_id
         WHERE cc.user_id = ? AND cc.completed = true
         ORDER BY c.week_start_date DESC
         LIMIT ?`,
        [userId, Number(limit)]
    );
    return rows;
};
exports.didUserCompleteCurrentChallenge = async (userId) => {
  // מוצא את אתגר השבוע לפי תאריך התחלה שמתאים לשבוע הנוכחי
  const [currentChallenge] = await pool.query(`
    SELECT id FROM weekly_challenges
    WHERE week_start_date <= CURDATE()
      AND DATE_ADD(week_start_date, INTERVAL 6 DAY) >= CURDATE()
    LIMIT 1
  `);

  if (currentChallenge.length === 0) {
    return { completed: false, message: "אין אתגר לשבוע הנוכחי" };
  }

  const challengeId = currentChallenge[0].id;

  // בדיקה אם המשתמש השלים את האתגר הזה
  const [rows] = await pool.query(`
    SELECT * FROM challenge_completions
    WHERE user_id = ? AND challenge_id = ? AND completed = true
  `, [userId, challengeId]);

  return { completed: rows.length > 0, challengeId };
};

exports.markCompleted = async (userId, challengeId) => {
    await pool.query(`
        INSERT INTO challenge_completions (user_id, challenge_id, completed)
        VALUES (?, ?, true)
        ON DUPLICATE KEY UPDATE completed = true
    `, [userId, challengeId]);
};

exports.unmarkCompleted = async (userId, challengeId) => {
    await pool.query(`
        UPDATE challenge_completions SET completed = false
        WHERE user_id = ? AND challenge_id = ?
    `, [userId, challengeId]);
};
