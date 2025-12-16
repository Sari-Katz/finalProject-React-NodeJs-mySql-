const pool = require('../../DB/Connection');

/**
 * Fetches the daily calorie status for a specific user.
 * This includes their goal, consumed calories, and burned calories for the current day.
 * @param {number} userId The ID of the user.
 * @returns {Promise<object>} An object with the user's calorie status.
 */
const getTodaysStatus = async (userId) => {
    // Get the user's daily goal from the users table
    const [userRows] = await pool.query(
        'SELECT daily_calorie_goal FROM users WHERE id = ?',
        [userId]
    );

    if (!userRows || userRows.length === 0) {
        throw new Error('User not found');
    }

    const daily_calorie_goal = userRows[0].daily_calorie_goal;

    // Get today's consumed and burned calories
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const [trackingRows] = await pool.query(
        'SELECT consumed_calories, burned_calories FROM daily_calorie_tracking WHERE user_id = ? AND entry_date = ?',
        [userId, today]
    );

    // If no entry for today, return defaults
    const todaysTracking = trackingRows[0] || { consumed_calories: 0, burned_calories: 0 };

    return {
        daily_calorie_goal,
        ...todaysTracking,
    };
};

/**
 * Logs consumed calories for a user on the current date.
 * It will create a new entry for the day or update an existing one.
 * @param {number} userId The ID of the user.
 * @param {number} caloriesToAdd The number of calories to add.
 * @returns {Promise<object>}
 */
const logMeal = async (userId, caloriesToAdd) => {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    const [result] = await pool.query(
        `INSERT INTO daily_calorie_tracking (user_id, entry_date, consumed_calories)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE consumed_calories = consumed_calories + ?`,
        [userId, today, caloriesToAdd, caloriesToAdd]
    );

    return { affectedRows: result.affectedRows };
};

/**
 * Logs burned calories for a user on the current date.
 * It will create a new entry for the day or update an existing one.
 * @param {number} userId The ID of the user.
 * @param {number} caloriesToBurn The number of calories to add to the burned total.
 * @returns {Promise<object>}
 */
const logActivity = async (userId, caloriesToBurn) => {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    const [result] = await pool.query(
        `INSERT INTO daily_calorie_tracking (user_id, entry_date, burned_calories)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE burned_calories = burned_calories + ?`,
        [userId, today, caloriesToBurn, caloriesToBurn]
    );

    return { affectedRows: result.affectedRows };
};

module.exports = { getTodaysStatus, logMeal, logActivity };