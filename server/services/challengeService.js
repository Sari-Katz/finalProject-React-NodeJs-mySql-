
const pool = require('../../DB/Connection');
exports.getAllChallenges = async (limit, offset) => {
    const [rows] = await pool.query(
        'SELECT * FROM weekly_challenges LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};
exports.markChallengeCompletion = async (userId, challengeId, completed) =>{
    const [existing] = await pool.query(
      'SELECT * FROM challenge_completions WHERE user_id = ? AND challenge_id = ?',
      [userId, challengeId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE challenge_completions SET completed = ? WHERE user_id = ? AND challenge_id = ?',
        [completed, userId, challengeId]
      );
    } else {
      await pool.query(
        'INSERT INTO challenge_completions (user_id, challenge_id, completed) VALUES (?, ?, ?)',
        [userId, challengeId, completed]
      );
    }
  },

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

exports.getChallengeByDate=async(week_start_date) =>{
    const [rows] = await pool.query(
        "SELECT * FROM weekly_challenges WHERE week_start_date = ?",
        [week_start_date]
    );
    return rows[0]; 
}

exports.getUserChallengesByStatus = async (userId, completed) => {
    const [rows] = await pool.query(
        `SELECT c.* FROM weekly_challenges c
         JOIN challenge_completions cc ON c.id = cc.challenge_id
         WHERE cc.user_id = ? AND cc.completed = ?`,
        [userId, completed === 'true']
    )
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

exports.updateChallenge = async (id, week_start_date, description) => {
  const query = `
    UPDATE weekly_challenges
    SET week_start_date = ?, description = ?
    WHERE id = ?
  `;

  await pool.query(query, [week_start_date, description, id]);
};

exports.didUserCompleteCurrentChallenge = async (userId) => {
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
  const [rows] = await pool.query(`
    SELECT * FROM challenge_completions
    WHERE user_id = ? AND challenge_id = ? AND completed = true
  `, [userId, challengeId]);

  return { completed: rows.length > 0, challengeId };
};


