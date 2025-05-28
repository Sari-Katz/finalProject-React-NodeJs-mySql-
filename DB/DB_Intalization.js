// init-db.js
import pool from './Connection.js';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
// אפשר להחליף ל-console.log אם אין לך logger
import logger from '../server/utils/logger.js';

const saltRounds = 10;

async function initDb() {
    try {
        const db = JSON.parse(await fs.readFile('./../db/db.json', 'utf-8'));

        logger.info('⛔ Dropping existing tables...');
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('DROP TABLE IF EXISTS challenge_completions');
        await pool.query('DROP TABLE IF EXISTS course_participants');
        await pool.query('DROP TABLE IF EXISTS user_credentials');
        await pool.query('DROP TABLE IF EXISTS weekly_challenges');
        await pool.query('DROP TABLE IF EXISTS classes');
        await pool.query('DROP TABLE IF EXISTS users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        logger.info('🛠️ Creating tables...');
        await pool.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
        CREATE TABLE user_credentials (
        user_id INT,
        password_hash VARCHAR(255) NOT NULL,
        last_login TIMESTAMP NULL,
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

        await pool.query(`
      CREATE TABLE classes  (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        class_types  TEXT,
        day_of_week ENUM('ראשון','שני','שלישי','רביעי','חמישי','שישי','מוצ"ש'),
        start_time TIME,
        date_start DATE,
        end_time TIME  )
    `);

        await pool.query(`
      CREATE TABLE weekly_challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        week_start_date DATE NOT NULL,
        description TEXT
      )
    `);

        await pool.query(`
      CREATE TABLE course_participants (
        user_id INT,
        course_id INT,
        status VARCHAR(50) DEFAULT 'נרשמה',
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES classes(id) ON DELETE CASCADE
      )
    `);

        await pool.query(`
      CREATE TABLE challenge_completions (
        user_id INT,
        challenge_id INT,
        completed BOOLEAN DEFAULT false,
        PRIMARY KEY (user_id, challenge_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES weekly_challenges(id) ON DELETE CASCADE
      )
    `);

        logger.info('✅ Inserting data...');

        // הכנסת משתמשות והסיסמאות
        for (const user of db.users) {
            await pool.query(
                'INSERT INTO users (id, full_name, email, phone) VALUES (?, ?, ?, ?)',
                [user.id, user.full_name, user.email, user.phone]
            );
            const hash = await bcrypt.hash(user.password, saltRounds);
            await pool.query(
                'INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)',
                [user.id, hash]
            );
        }

        // הכנסת קורסים
        for (const course of db.classes) {

            await pool.query(
                'INSERT INTO classes (id, title, description, day_of_week, start_time, date_start, duration_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [course.id, course.title, course.description, course.day_of_week, course.start_time, course.date_start, course.duration_minutes]
            );
        }

        // הכנסת אתגרים שבועיים
        for (const challenge of db.weekly_challenges) {
            await pool.query(
                'INSERT INTO weekly_challenges (id, week_start_date, description) VALUES (?, ?, ?)',
                [challenge.id, challenge.week_start_date, challenge.description]
            );
        }

        // הכנסת משתתפות בקורסים
        for (const participant of db.course_participants) {
            await pool.query(
                'INSERT INTO course_participants (user_id, course_id, joined_at, status) VALUES (?, ?, ?, ?)',
                [participant.user_id, participant.course_id, participant.joined_at, participant.status]
            );
        }

        // הכנסת השלמות אתגרים
        for (const cc of db.challenge_completions) {
            await pool.query(
                'INSERT INTO challenge_completions (user_id, challenge_id, completed_at) VALUES (?, ?, ?)',
                [cc.user_id, cc.challenge_id, cc.completed_at]
            );
        }

        logger.info('✅ All data inserted successfully.');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Setup error: ' + err.message);
        process.exit(1);
    }
}

initDb();