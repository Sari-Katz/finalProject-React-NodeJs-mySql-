const pool = require('../../DB/Connection');

exports.getAllPlans = async () => {
  const [rows] = await pool.query('SELECT * FROM subscription_plans');
  return rows;
};
exports.registerToSubscription = async(userId, subscriptionId, startDate, endDate) => {
 await pool.query(
      'INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?)',
      [userId, subscriptionId, startDate, endDate]
    );
  
};

exports.getActiveByUserId = async (userId) => {
  const [rows] = await pool.query(`
    SELECT * FROM user_subscriptions 
    WHERE user_id = ? AND end_date >= CURRENT_DATE
    ORDER BY end_date DESC
    LIMIT 1
  `, [userId]);
  return rows[0] || null;
};

exports.getAllSubscriptions = async () => {
  const [rows] = await pool.query('SELECT * FROM user_subscriptions');
  return rows;
};