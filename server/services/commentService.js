const pool = require('../../DB/Connection');
const db=pool;

exports.createComment = async function createComment(commentData) {
    const { post_id, user_id, content } = commentData;
    const query = `
        INSERT INTO comments (post_id, user_id, content)
        VALUES (?, ?, ?)
    `;
    const values = [post_id, user_id, content];

    try {
        const [result] = await db.execute(query, values);
        const newCommentId = result.insertId;

        const fetchQuery = `
            SELECT comments.comment_id, comments.content, comments.created_at, users.id AS user_id, users.username, users.email
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.comment_id = ?
        `;
        const [rows] = await db.execute(fetchQuery, [newCommentId]);
        return rows[0];
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

exports.getCommentsByPostId = async function getCommentsByPostId(postId) {
    const query = `
        SELECT comments.comment_id, comments.content, comments.created_at, users.username, users.email
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `;
    try {
        const [rows] = await db.execute(query, [postId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

exports.getCommentsByUserId = async function getCommentsByUserId(userId) {
    const query = `
        SELECT comments.comment_id, comments.content, comments.created_at, posts.title
        FROM comments
        JOIN posts ON comments.post_id = posts.post_id
        WHERE comments.user_id = ?
        ORDER BY comments.created_at DESC
    `;

    try {
        const [rows] = await db.execute(query, [userId]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

exports.updateCommentById = async function updateCommentById(commentId, content) {
    const query = `
        UPDATE comments
        SET content = ?
        WHERE comment_id = ?
    `;
    const values = [content, commentId];

    try {
        const [result] = await db.execute(query, values);
        if (result.affectedRows > 0) {
            const fetchQuery = `
                SELECT comments.comment_id, comments.content, comments.created_at, users.username, users.email
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE comments.comment_id = ?
            `;
            const [rows] = await db.execute(fetchQuery, [commentId]);
            return rows[0];
        }
        return null;
    } catch (error) {
        throw new Error('Error updating comment: ' + error.message);
    }
};

exports.deleteCommentById = async function deleteCommentById(commentId) {
    const query = 'DELETE FROM comments WHERE comment_id = ?';
    try {
        const [result] = await db.execute(query, [commentId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }
};

exports.partialUpdateCommentById = async (id, updates) => {
    try {
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const query = `UPDATE comments SET ${fields} WHERE comment_id = ?`;
        const [result] = await db.execute(query, [...values, id]);
        return result.affectedRows > 0 ? { comment_id: id, ...updates } : null;
    } catch (error) {
        console.error('Error in partialUpdateCommentById service:', error);
        throw error;
    }
};
