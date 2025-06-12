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
exports.getSubscriptionPlanById=async(id) =>{
        const [rows] = await pool.query(
            'SELECT * FROM subscription_plans WHERE id = ?',
            [id]
        );
        return rows[0];
    };
