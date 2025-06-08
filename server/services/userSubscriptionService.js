const pool = require('../../DB/Connection');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM user_subscriptions');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM user_subscriptions WHERE id = ?', [id]);
  return rows[0];
};

exports.getByUserId = async (userId) => {
  const [rows] = await pool.query(`
    SELECT * FROM user_subscriptions 
    WHERE user_id = ? AND CURRENT_DATE BETWEEN start_date AND end_date
  `, [userId]);
  return rows[0]; // או rows אם רוצים את כל ההיסטוריה
};

exports.create = async (data) => {
  const { user_id, plan_id, start_date, end_date } = data;
  const [result] = await pool.query(`
    INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `, [user_id, plan_id, start_date, end_date]);
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { user_id, plan_id, start_date, end_date } = data;
  await pool.query(`
    UPDATE user_subscriptions
    SET user_id = ?, plan_id = ?, start_date = ?, end_date = ?
    WHERE id = ?
  `, [user_id, plan_id, start_date, end_date, id]);
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query('DELETE FROM user_subscriptions WHERE id = ?', [id]);
};
