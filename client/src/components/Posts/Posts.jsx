import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
import styles from './Posts.module.css';
import ApiUtils from '../../utils/ApiUtils';

function Posts() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userId = user.id;
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');
    const [truncatedPosts, setTruncatedPosts] = useState({});
    const apiService = new ApiUtils();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await apiService.get(`http://localhost:3000/posts`);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleAddPost = async () => {
        if (newPostTitle.trim() && newPostBody.trim()) {
            const newPost = {
                user_id: userId,
                title: newPostTitle,
                content: newPostBody,
            };
            try {
                const post = await apiService.post('http://localhost:3000/posts', newPost);
                setPosts([post, ...posts]);
                setNewPostTitle('');
                setNewPostBody('');
            } catch (error) {
                console.error('Error adding post:', error);
            }
        }
    };

    const handleDeletePost = async (index, id) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
            try {
                await apiService.delete(`http://localhost:3000/posts/${id}`);
                const updatedAllPosts = [...posts];
                updatedAllPosts.splice(index, 1);
                setPosts(updatedAllPosts);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> פוסטים</h1>

            {/* Add New Post - Admin Only */}
            {(user.role === 'admin') && (
                <div className={styles.newPost}>
                    <h3> הוספת פוסט חדש</h3>
                    <input
                        type="text"
                        placeholder="כותרת הפוסט..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className={styles.postInput}
                    />
                    <textarea
                        placeholder="תוכן הפוסט..."
                        value={newPostBody}
                        onChange={(e) => setNewPostBody(e.target.value)}
                        className={styles.postTextarea}
                        rows="4"
                    />
                    <button 
                        className={styles.addButton} 
                        onClick={handleAddPost}
                        disabled={!newPostTitle.trim() || !newPostBody.trim()}
                    >
                         הוסף פוסט
                    </button>
                </div>
            )}

            {/* Posts Grid */}
            <div className={styles.postGrid}>
                {posts.length === 0 ? (
                    <div className={styles.noPosts}>
                        <h3>📭 אין פוסטים עדיין</h3>
                        <p>היה הראשון להוסיף פוסט!</p>
                    </div>
                ) : (
                    posts.map((post, index) => {
                        const isTruncated = truncatedPosts[post.post_id];
                        const isLongContent = post.content && post.content.length > 200;

                        return (
                            <div key={post.post_id} className={styles.postCard}>
                                {/* Post Header */}
                                {/* <div className={styles.postHeader}>
                                    <h3 className={styles.postTitle}>{post.title}</h3>
                                    {user.role === 'admin' && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeletePost(index, post.post_id)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div> */}

                                {/* Post Content Preview */}
                                <div className={styles.postContentWrapper}>
                                    <div className={styles.postContent}>
                                        {isLongContent 
                                            ? `${post.content.substring(0, 200)}...`
                                            : post.content
                                        }
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles.postActions}>
                                    {isLongContent && (
                                        <button
                                            className={styles.readMoreButton}
                                            onClick={() => navigate(`/post/${post.post_id}`)}
                                        >
                                            📖 המשך קריאה
                                        </button>
                                    )}
                                    <button 
                                        className={styles.commentsButton}
                                        onClick={() => navigate(`/post/${post.post_id}`)}
                                    >
                                        💬 תגובות
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Posts;