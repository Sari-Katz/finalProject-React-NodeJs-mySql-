-- יצירת בסיס נתונים
CREATE DATABASE IF NOT EXISTS finalProject
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finalProject;

-- =====================
-- טבלאות
-- =====================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  role ENUM('user','admin','guide') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  daily_calorie_goal INT DEFAULT 2000
);

CREATE TABLE IF NOT EXISTS user_credentials (
  user_id INT PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_days INT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  class_types TEXT,
  day_of_week ENUM('ראשון','שני','שלישי','רביעי','חמישי','שישי','מוצ"ש'),
  start_time TIME,
  date_start DATE,
  end_time TIME
);

CREATE TABLE IF NOT EXISTS weekly_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  week_start_date DATE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS classes_participants (
  user_id INT,
  class_id INT,
  status VARCHAR(50) DEFAULT 'נרשמה',
  PRIMARY KEY (user_id, class_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenge_completions (
  user_id INT,
  challenge_id INT,
  completed BOOLEAN DEFAULT false,
  PRIMARY KEY (user_id, challenge_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES weekly_challenges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_calorie_tracking (
  user_id INT NOT NULL,
  entry_date DATE NOT NULL,
  consumed_calories INT DEFAULT 0,
  burned_calories INT DEFAULT 0,
  PRIMARY KEY (user_id, entry_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

