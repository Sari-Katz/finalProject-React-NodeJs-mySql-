const pool = require('../../DB/Connection'); // adjust the path as needed
const bcrypt = require('bcrypt');

const userService = {
    // Create a new user and credentials
    async createUser({ full_name, email, phone, password }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Insert into users table
            const [userResult] = await conn.query(
                'INSERT INTO users (full_name, email, phone) VALUES (?, ?, ?)',
                [full_name, email, phone]
            );
            const userId = userResult.insertId;

            // Hash password and insert into user_credentials
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

    // Get user by email (with credentials)
    async getUserByEmail(email) {
        const [rows] = await pool.query(
            `SELECT u.*, uc.password_hash
             FROM users u
             JOIN user_credentials uc ON u.id = uc.user_id
             WHERE u.email = ?`,
            [email]
        );
        return rows[0];
    },

    // Get user by id (without password)
    async getUserById(id) {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },
// Get all users (without passwords)
async getAllUsers() {
    const [rows] = await pool.query(
        'SELECT id, full_name, email, phone, created_at FROM users'
    );
    return rows;
},
    // Delete user (will cascade to credentials)
    async deleteUser(user_id) {
        await pool.query('DELETE FROM users WHERE id = ?', [user_id]);
      },
  
    // Search users with filters (without passwords)
    async searchUsers(filters) {
        let query = 'SELECT id, full_name, email, phone, created_at FROM users WHERE 1=1';
        const params = [];

        for (const [key, value] of Object.entries(filters)) {
            query += ` AND ${key} = ?`;
            params.push(value);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    }
};




module.exports = userService;
