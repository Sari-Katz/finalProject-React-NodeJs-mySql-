import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../AuthContext";
import ApiUtils from '../../utils/ApiUtils';
import CommentsSection from './CommentsSection';
import styles from './SinglePostView.module.css';

function SinglePostView() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [editPostBody, setEditPostBody] = useState('');
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const data = await ApiUtils.get(`http://localhost:3000/posts/${postId}`);
            setPost(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching post:', error);
            setLoading(false);
        }
    };

    const handleUpdatePost = async (id, newBody) => {
        const updatedPost = { ...post, content: newBody };
        try {
            const response = await ApiUtils.put(`http://localhost:3000/posts/${id}`, updatedPost);
            setPost(response);
            setIsEditingPost(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
            try {
                await ApiUtils.delete(`http://localhost:3000/posts/${postId}`);
                navigate('/posts');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const startEditing = () => {
        setEditPostBody(post.content);
        setIsEditingPost(true);
    };

    const cancelEditing = () => {
        setEditPostBody('');
        setIsEditingPost(false);
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
                <h1 className={styles.pageTitle}>פוסט מורחב</h1>
            </div>

            {/* Post Content */}
            <div className={styles.postContainer}>
                <div className={styles.postHeader}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    {user.role === 'admin' && (
                        <div className={styles.postActions}>
                            <button
                                onClick={startEditing}
                                className={styles.editButton}
                                disabled={isEditingPost}
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
{/* 
                Post Image
                {post.image_url && (
                    <div className={styles.postImageWrapper}>
                        <img 
                            src={`http://localhost:3000${post.image_url}`} 
                            alt={post.title}
                            className={styles.postImage}
                        />
                    </div>
                )} */}

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
                                    onClick={cancelEditing}
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
            <CommentsSection postId={postId} />
        </div>
    );
}

export default SinglePostView;