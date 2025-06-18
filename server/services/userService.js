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
    console.log({ rows });
    return rows[0];
  },

  // קבלת משתמש לפי מזהה (בלי סיסמה)
  async getUserById(id) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone,role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  async getUsersByIds(userIds) {

    if (userIds.length === 0) return [];

    const [rows] = await pool.query(
      `SELECT id, full_name, email, phone FROM users WHERE id IN (?)`,
      [userIds]
    );

    return rows;
  },
  // services/userService.js

  async getEmailsByUserIds(userIds) {
    if (userIds.length === 0) return [];

    const placeholders = userIds.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT email FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    return rows.map(row => row.email).filter(Boolean);
  },
  // קבלת כל המשתמשים (בלי סיסמאות)
  async getAllUsers() {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone,role, created_at FROM users'
    );
    return rows;
  },

  // חיפוש משתמשים עם פילטרים (בלי סיסמאות)
  async searchUsers(filters) {
    let query = 'SELECT id, full_name, email, phone,role, created_at FROM users WHERE 1=1';
    const params = [];

    for (const [key, value] of Object.entries(filters)) {
      query += ` AND ${key} = ?`;
      params.push(value);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getUserDashboard(userId) {
    // שליפת האתגרים שהושלמו
    const [completedChallenges] = await pool.query(
     
      `SELECT c.*
         FROM weekly_challenges c
         JOIN challenge_completions cc ON c.id = cc.challenge_id
         WHERE cc.user_id = ? AND cc.completed = true
         ORDER BY c.week_start_date DESC
         LIMIT 10`,
      [userId]
    );
    // שליפת השיעורים שהמשתמש היה בהם בחודש האחרון
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const isoDate = oneMonthAgo.toISOString().split('T')[0];

    const query = `
    SELECT c.id, c.title, c.class_types, c.day_of_week, c.start_time, c.date_start, c.end_time
    FROM classes c
    JOIN classes_participants cp ON c.id = cp.class_id
    WHERE cp.user_id = ? AND c.date_start >= ?
  `;
    const [classes] = await pool.query(query, [userId, isoDate]);  
    // בדיקה אם השלים את אתגר השבוע הנוכחי
    const [currentChallenge] = await pool.query(
      `SELECT id,description FROM weekly_challenges
    WHERE week_start_date <= CURDATE()
    AND DATE_ADD(week_start_date, INTERVAL 6 DAY) >= CURDATE()
    LIMIT 1`
    );
    let hasCompletedCurrent = false;
    if (currentChallenge.length > 0) {
      const challengeId = currentChallenge[0].id;
      const [completion] = await pool.query(
        `SELECT * FROM challenge_completions
       WHERE user_id = ? AND challenge_id = ? AND completed = true`,
        [userId, challengeId]
      );
      hasCompletedCurrent = completion.length > 0;
    }
    console.log(hasCompletedCurrent);

    return {
      recentClasses: classes,
      recentCompletedChallenges: completedChallenges,
      completedWeeklyChallenge: hasCompletedCurrent,
      weeklyChallenge: currentChallenge[0]
    };
  },

  //עשינו בשלב הזה בקשת פאטש אולי היה אפשר לעשות רק עדכון
  async markChallengeCompletion(userId, challengeId, completed) {
    const [existing] = await pool.query(
      'SELECT * FROM challenge_completions WHERE user_id = ? AND challenge_id = ?',
      [userId, challengeId]
    );

    if (existing.length > 0) {
      // אם כבר יש שורה, נעשה UPDATE עם הערך שנשלח
      await pool.query(
        'UPDATE challenge_completions SET completed = ? WHERE user_id = ? AND challenge_id = ?',
        [completed, userId, challengeId]
      );
    } else {
      // אחרת, INSERT עם הערך שנשלח
      await pool.query(
        'INSERT INTO challenge_completions (user_id, challenge_id, completed) VALUES (?, ?, ?)',
        [userId, challengeId, completed]
      );
    }
  },
  async registerUserToClass(userId, classId) {
    const [existing] = await pool.query(
      'SELECT * FROM classes_participants WHERE user_id = ? AND class_id = ?',
      [userId, classId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE classes_participants SET status = ? WHERE user_id = ? AND class_id = ?',
        ['נרשמה', userId, classId]
      );
    } else {
      await pool.query(
        'INSERT INTO classes_participants (user_id, class_id, status) VALUES (?, ?, ?)',
        [userId, classId, 'נרשמה']
      );
    }
  },
 async update (id, data) {
 
  const { user_id, full_name, email, phone } = data;
  await pool.query(`
    UPDATE users
    SET user_id = ?, full_name = ?, email = ?, phone = ?
    WHERE id = ?
  `, [user_id, full_name, email, phone ]);
  return { id, ...data };
},
  async unregisterUserFromClass(userId, classId) {
    await pool.query(
      'UPDATE classes_participants SET status = ? WHERE user_id = ? AND class_id = ?',
      ['בוטלה', userId, classId]
    );
  },
  async isUserRegisteredToClass(userId, classId) {
    const [result] = await pool.query(
      'SELECT * FROM classes_participants WHERE user_id = ? AND class_id = ? AND status =?',
      [userId, classId, 'נרשמה']
    );
    return result.length > 0;
  }


};

module.exports = userService;