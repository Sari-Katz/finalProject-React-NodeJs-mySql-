import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../AuthContext";
import ApiUtils from '../../utils/ApiUtils';
import CommentItem from './CommentItem';
import styles from './Comments.module.css';

function CommentsSection({ postId }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState("");
    const [loading, setLoading] = useState(true);
    
    const apiService = new ApiUtils();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const data = await apiService.get(`http://localhost:3000/comments/${postId}`);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newCommentBody.trim()) {
            const newComment = {
                post_id: postId,
                user_id: user.id,
                content: newCommentBody,
            };

            try {
                const comment = await apiService.post('http://localhost:3000/comments', newComment);
                setComments([...comments, comment]);
                setNewCommentBody("");
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleEditComment = async (commentId, newBody) => {
        try {
            const updatedComment = {
                content: newBody,
            };

            await apiService.put(`http://localhost:3000/comments/${commentId}`, updatedComment);
            
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.comment_id === commentId
                        ? { ...comment, content: newBody }
                        : comment
                )
            );
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await apiService.delete(`http://localhost:3000/comments/${commentId}`);
            setComments(prevComments =>
                prevComments.filter(comment => comment.comment_id !== commentId)
            );
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) {
        return (
            <div className={styles.commentsSection}>
                <div className={styles.loadingComments}>
                    <div className={styles.spinner}></div>
                    <p>טוען תגובות...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>
                💬 תגובות ({comments.length})
            </h3>

            {/* Add Comment */}
            <div className={styles.addCommentSection}>
                <h4>הוסף תגובה חדשה</h4>
                <textarea
                    className={styles.commentTextarea}
                    placeholder="כתוב את תגובתך כאן..."
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                    rows="4"
                />
                <button
                    className={styles.addCommentButton}
                    onClick={handleAddComment}
                    disabled={!newCommentBody.trim()}
                >
                    📝 הוסף תגובה
                </button>
            </div>

            {/* Comments List */}
            <div className={styles.commentsList}>
                {comments.length === 0 ? (
                    <div className={styles.noComments}>
                        <p>אין תגובות עדיין. היה הראשון להגיב!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.comment_id}
                            comment={comment}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentsSection;