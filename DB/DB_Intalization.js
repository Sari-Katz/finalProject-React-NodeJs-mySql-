// init-db.js
const pool = require('./Connection.js');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const logger = require('../server/utils/logger.js');

const saltRounds = 10;

async function initDb() {
    try {
        const dbRaw = await fs.readFile('./../db/db.json', 'utf-8');
        const db = JSON.parse(dbRaw);

        logger.info('⛔ Dropping existing tables...');
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('DROP TABLE IF EXISTS challenge_completions');
        await pool.query('DROP TABLE IF EXISTS classes_participants');
        await pool.query('DROP TABLE IF EXISTS user_credentials');
         await pool.query('DROP TABLE IF EXISTS subscription_plans');
        await pool.query('DROP TABLE IF EXISTS user_subscriptions');
        await pool.query('DROP TABLE IF EXISTS weekly_challenges');
        await pool.query('DROP TABLE IF EXISTS classes');
        await pool.query('DROP TABLE IF EXISTS users');
        await pool.query('DROP TABLE IF EXISTS subscription_plans');
        await pool.query('DROP TABLE IF EXISTS user_subscriptions');
        await pool.query('DROP TABLE IF EXISTS posts');
        await pool.query('DROP TABLE IF EXISTS comments');
        await pool.query('DROP TABLE IF EXISTS daily_calorie_tracking');
     

        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        
        logger.info('🛠️ Creating tables...');
        await pool.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                role ENUM('user', 'admin', 'guide') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                daily_calorie_goal INT DEFAULT 2000
            )
        `);
await pool.query(`
    CREATE TABLE subscription_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        duration_days INT NOT NULL -- כמה ימים המנוי נמשך
    )
`);

await pool.query(`
    CREATE TABLE user_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
    )
`);
        await pool.query(`
            CREATE TABLE user_credentials (
                user_id INT,
                password_hash VARCHAR(255) NOT NULL,
                PRIMARY KEY (user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE classes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                class_types TEXT,
                day_of_week ENUM('ראשון','שני','שלישי','רביעי','חמישי','שישי','מוצ"ש'),
                start_time TIME,
                date_start DATE,
                end_time TIME
            )
        `);

        await pool.query(`
            CREATE TABLE weekly_challenges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                week_start_date DATE NOT NULL,
                description TEXT
            )
        `);

        await pool.query(`
            CREATE TABLE classes_participants (
                user_id INT,
                class_id INT,
                status VARCHAR(50) DEFAULT 'נרשמה',
                PRIMARY KEY (user_id, class_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
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

            await pool.query(`
      CREATE TABLE posts (
        post_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE comments (
        comment_id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
        await pool.query(`
            CREATE TABLE daily_calorie_tracking (
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    consumed_calories INT DEFAULT 0,
    burned_calories INT DEFAULT 0,
    PRIMARY KEY (user_id, entry_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
        `);
        

        logger.info('✅ Inserting data...');

        for (const user of db.users) {
            await pool.query(
                'INSERT INTO users (id, full_name, email, phone, role, daily_calorie_goal) VALUES (?, ?, ?, ?, ?, ?)',
                [user.id, user.full_name, user.email, user.phone, user.role, user.daily_calorie_goal || 2000]
            );
            const hash = await bcrypt.hash(user.password, saltRounds);
            await pool.query(
                'INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)',
                [user.id, hash]
            );
        }

        try {
            for (const course of db.classes) {
                await pool.query(
                    'INSERT INTO classes (id, title, class_types, day_of_week, start_time, date_start, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [course.id, course.title, course.class_types, course.day_of_week, course.start_time, course.date_start, course.end_time]
                );
            }
        } catch (err) {
            logger.error('❌ Error inserting classes: ' + err.message);
        }

        for (const challenge of db.weekly_challenges) {
            await pool.query(
                'INSERT INTO weekly_challenges (id, week_start_date, description) VALUES (?, ?, ?)',
                [challenge.id, challenge.week_start_date, challenge.description]
            );
        }

        for (const participant of db.classes_participants) {
            await pool.query(
                'INSERT INTO classes_participants (user_id, class_id, status) VALUES (?, ?, ?)',
                [participant.user_id, participant.class_id, participant.status]
            );
        }

        for (const cc of db.challenge_completions) {
            await pool.query(
                'INSERT INTO challenge_completions (user_id, challenge_id, completed) VALUES (?, ?, ?)',
                [cc.user_id, cc.challenge_id, cc.completed]
            );
        }

        if (db.subscription_plans) {
    for (const plan of db.subscription_plans) {
        await pool.query(
            'INSERT INTO subscription_plans (id, name, description, price, duration_days) VALUES (?, ?, ?, ?, ?)',
            [plan.id, plan.name, plan.description, plan.price, plan.duration_days]
        );
    }
}

if (db.user_subscriptions) {
    for (const sub of db.user_subscriptions) {
        await pool.query(
            'INSERT INTO user_subscriptions (id, user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [sub.id, sub.user_id, sub.plan_id, sub.start_date, sub.end_date]
        );
    }
}// Insert posts
if (db.posts) {
    for (const post of db.posts) {
        await pool.query(
            'INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)',
            [post.user_id, post.title, post.content, post.created_at]
        );
    }
}

// Insert comments
if (db.comments) {
    for (const comment of db.comments) {
        await pool.query(
            'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)',
            [comment.post_id, comment.user_id, comment.content, comment.created_at]
        );
    }
}

// Insert daily calorie tracking
if (db.daily_calorie_tracking) {
    for (const tracking of db.daily_calorie_tracking) {
        await pool.query(
            'INSERT INTO daily_calorie_tracking (user_id, entry_date, consumed_calories, burned_calories) VALUES (?, ?, ?, ?)',
            [tracking.user_id, tracking.entry_date, tracking.consumed_calories, tracking.burned_calories]
        );
    }
}


        logger.info('✅ All data inserted successfully.');
        process.exit(0);
    } catch (err) {
        logger.error('❌ Setup error: ' + err.message);
        process.exit(1);
    }
}

// Call the function (no await at top level)
initDb();
