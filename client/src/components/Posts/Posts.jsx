
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
import ViewPost from './ViewPost';
import styles from './Posts.module.css';
import ApiUtils from '../../utils/ApiUtils';

function Posts() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userId = user.id;
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
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
        try {
            await apiService.delete(`http://localhost:3000/posts/${id}`);
            const updatedAllPosts = [...posts];
            updatedAllPosts.splice(index, 1);
            setPosts(updatedAllPosts);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Posts</h1>

            {(user.role == 'admin') && <div className={styles.newPost}>
                <h3>Add New Post</h3>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <textarea
                    placeholder="Post Body"
                    value={newPostBody}
                    onChange={(e) => setNewPostBody(e.target.value)}
                />
                <button className={styles.addbutton} onClick={handleAddPost}>Add Post</button>
            </div>}

            <div className={styles.postGrid}>
                {posts.map((post, index) => {
                    const isSelected = selectedPost && selectedPost.post_id === post.post_id;
                    const isTruncated = truncatedPosts[post.post_id];

                    return (
                        <li key={post.post_id} className={styles.postItem}>
                            <div className={styles.postHeader}>
                                <span className={styles.post_title}>
                                    {post.post_id} - {post.title}
                                </span>
                                <div className={styles.actions}>

                                    {user.role === 'admin' && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeletePost(index, post.post_id)}
                                        >
                                        מחיקה🗑️
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.postContentWrapper}>
                                {!isSelected && (
                                    <>
                                        <div
                                            className={`${styles.postContent} ${isTruncated ? styles.truncated : ''}`}
                                            ref={(el) => {
                                                if (el && el.scrollHeight > 100 && !truncatedPosts[post.post_id]) {
                                                    setTruncatedPosts(prev => ({
                                                        ...prev,
                                                        [post.post_id]: true
                                                    }));
                                                }
                                            }}
                                        >
                                            {post.content}
                                        </div>

                                        {isTruncated && (
                                            <button
                                                className={`${styles.readMore} ${isSelected ? styles.active : ''}`}
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                המשך קריאה...
                                            </button>

                                        )}
                                    </>
                                )}

                                {isSelected && (
                                    <ViewPost
                                        post={post}
                                        index={index}
                                        setPosts={setPosts}
                                        posts={posts}
                                        setSelectedPost={setSelectedPost}
                                    />
                                )}
                            </div>
                            <button onClick={() => navigate(`/user/${userId}/post/${post.post_id}/comments`)}>
                                Comments
                            </button>
                        </li>
                    );
                })}
            </div>
        </div>
    );
}

export default Posts;

