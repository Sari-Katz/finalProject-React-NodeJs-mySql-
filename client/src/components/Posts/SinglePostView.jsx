import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthContext";
import ApiUtils from '../../utils/ApiUtils';
import styles from './SinglePostView.module.css';

function SinglePostView() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentBody, setNewCommentBody] = useState("");
    const [editPostBody, setEditPostBody] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedCommentIndex, setEditedCommentIndex] = useState(null);
    const [editedCommentBody, setEditedCommentBody] = useState("");
    const [loading, setLoading] = useState(true);
    
    const apiService = new ApiUtils();

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const data = await apiService.get(`http://localhost:3000/posts/${postId}`);
            setPost(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching post:', error);
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await apiService.get(`http://localhost:3000/comments/${postId}`);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleUpdatePost = async (id, newBody) => {
        const updatedPost = { ...post, content: newBody };
        try {
            const response = await apiService.put(`http://localhost:3000/posts/${id}`, updatedPost);
            setPost(response);
            setIsEditingPost(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
            try {
                await apiService.delete(`http://localhost:3000/posts/${postId}`);
                navigate('/posts');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
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

    const handleDeleteComment = async (index) => {
        const commentId = comments[index].CommentID;
        if (window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) {
            try {
                await apiService.delete(`http://localhost:3000/comments/${commentId}`);
                const updatedComments = [...comments];
                updatedComments.splice(index, 1);
                setComments(updatedComments);
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleEditComment = async (index, newBody) => {
        if (newBody.trim()) {
            const commentId = comments[index].CommentID;
            const updatedComment = {
                ...comments[index],
                content: newBody,
            };

            try {
                await apiService.put(`http://localhost:3000/comments/${commentId}`, updatedComment);
                const updatedComments = [...comments];
                updatedComments[index] = updatedComment;
                setComments(updatedComments);
                setEditedCommentIndex(null);
                setEditedCommentBody("");
            } catch (error) {
                console.error('Error editing comment:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>טוען פוסט...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.errorContainer}>
                <h2>פוסט לא נמצא</h2>
                <button onClick={() => navigate('/posts')} className={styles.backButton}>
                    חזרה לפוסטים
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => navigate('/posts')} className={styles.backButton}>
                    ← חזרה לפוסטים
                </button>
            </div>

            {/* Post Content */}
            <div className={styles.postContainer}>
                <div className={styles.postHeader}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    {user.role === 'admin' && (
                        <div className={styles.postActions}>
                            <button
                                onClick={() => {
                                    setEditPostBody(post.content);
                                    setIsEditingPost(true);
                                }}
                                className={styles.editButton}
                            >
                                ✏️ עריכה
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className={styles.deleteButton}
                            >
                                🗑️ מחיקה
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.postContent}>
                    {isEditingPost ? (
                        <div className={styles.editSection}>
                            <textarea
                                value={editPostBody}
                                onChange={(e) => setEditPostBody(e.target.value)}
                                className={styles.editTextarea}
                                rows="8"
                            />
                            <div className={styles.editActions}>
                                <button
                                    onClick={() => handleUpdatePost(post.post_id, editPostBody)}
                                    className={styles.saveButton}
                                >
                                    💾 שמור
                                </button>
                                <button
                                    onClick={() => setIsEditingPost(false)}
                                    className={styles.cancelButton}
                                >
                                    ❌ בטל
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.postText}>
                            {post.content}
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Section */}
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
                        comments.map((comment, index) => (
                            <div key={comment.comment_id} className={styles.commentItem}>
                                <div className={styles.commentHeader}>
                                    <div className={styles.commentAuthor}>
                                        <span className={styles.authorName}>👤 {comment.full_name}</span>
                                        <span className={styles.authorEmail}>{comment.email}</span>
                                    </div>
                                    {comment.email === user.email && (
                                        <div className={styles.commentActions}>
                                            <button
                                                className={styles.editCommentButton}
                                                onClick={() => {
                                                    setEditedCommentIndex(index);
                                                    setEditedCommentBody(comment.content);
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className={styles.deleteCommentButton}
                                                onClick={() => handleDeleteComment(index)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.commentContent}>
                                    {editedCommentIndex === index ? (
                                        <div className={styles.editCommentSection}>
                                            <textarea
                                                className={styles.editCommentTextarea}
                                                value={editedCommentBody}
                                                onChange={(e) => setEditedCommentBody(e.target.value)}
                                                rows="3"
                                            />
                                            <div className={styles.editCommentActions}>
                                                <button
                                                    className={styles.saveCommentButton}
                                                    onClick={() => handleEditComment(index, editedCommentBody)}
                                                >
                                                    💾 שמור
                                                </button>
                                                <button
                                                    className={styles.cancelCommentButton}
                                                    onClick={() => {
                                                        setEditedCommentIndex(null);
                                                        setEditedCommentBody("");
                                                    }}
                                                >
                                                    ❌ בטל
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={styles.commentText}>{comment.content}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SinglePostView;