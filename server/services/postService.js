const pool = require('../../DB/Connection');
const db=pool;
// Create new post
exports.createPost = async function createPost(postData) {
    const { user_id, title, content } = postData;
    const query = `
        INSERT INTO posts (user_id, title, content)
        VALUES (?, ?, ?)
    `;
    const values = [user_id, title, content];

    try {
        const [result] = await db.execute(query, values);
        const insertedPostQuery = 'SELECT * FROM posts WHERE post_id = ?';
        const [insertedPost] = await db.execute(insertedPostQuery, [result.insertId]);
        return insertedPost[0];
    } catch (error) {
        throw new Error('Error creating post: ' + error.message);
    }
};

exports.partialUpdatePostById = async (id, updates) => {
    try {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE posts SET ${fields} WHERE post_id = ?`;
        const [result] = await db.execute(query, [...values, id]);
        return result.affectedRows > 0 ? { post_id: id, ...updates } : null;
    } catch (error) {
        console.error('Error in partialUpdatePostById service:', error);
        throw error;
    }
};

exports.getPostById = async function getPostById(postId) {
    const query = 'SELECT * FROM posts WHERE post_id = ?';
    try {
        const [rows] = await db.execute(query, [postId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error fetching post: ' + error.message);
    }
};

exports.getAllPosts = async function getAllPosts(userId = null) {
    const query = userId 
        ? 'SELECT * FROM posts WHERE user_id = ?'
        : 'SELECT * FROM posts';
    const values = userId ? [userId] : [];

    try {
        const [rows] = await db.execute(query, values);
        // console.log('Fetched posts:', rows);
        return rows;
    } catch (error) {
        throw new Error('Error fetching posts: ' + error.message);
    }
};

exports.updatePostById = async function updatePostById(postId, postData) {
    const { content } = postData;
    const query = `
        UPDATE posts 
        SET content = ?
        WHERE post_id = ?
    `;
    const values = [content, postId];

    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const updatedPostQuery = 'SELECT * FROM posts WHERE post_id = ?';
            const [updatedRows] = await db.execute(updatedPostQuery, [postId]);
            return updatedRows[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating post: ' + error.message);
    }
};

exports.deletePostById = async function deletePostById(postId) {
    const query = 'DELETE FROM posts WHERE post_id = ?';
    try {
        const [result] = await db.execute(query, [postId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting post: ' + error.message);
    }
};