import React, { useState,useContext, useEffect } from 'react';
// import { useUserContext } from '../UserContext';   
import { AuthContext } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
import ViewPost from './ViewPost';
import styles from './Posts.module.css';
import ApiUtils from '../../utils/ApiUtils';

function Posts() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    // const { userData, isInitialized } = useUserContext();
    const userId = user.id;
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(userId);
    const apiService = new ApiUtils();

    useEffect(() => {
    fetchPosts();
    }, []);

    // useEffect(() => {
    //     if (isInitialized) {
    //         fetchUsers();
    //     }
    // }, [isInitialized]);

    const fetchPosts = async () => {
        try {
            console.log(userId)
            const data = await apiService.get(`http://localhost:3000/posts`);
            console.log('Fetched posts:', data);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // const fetchUsers = async () => {
    //     try {
    //         const data = await apiService.get(`http://localhost:3000/users`);
    //         setUsers(data);
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //     }
    // };

    const handleAddPost = async () => {
        if (newPostTitle.trim() && newPostBody.trim()) {
            const newPost = {
                user_id: userId,
                title: newPostTitle,
                content: newPostBody,
            };
            try {
                const post = await apiService.post('http://localhost:3000/posts', newPost);
                if (selectedUserId == userId)
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
            console.error('Error deleting todo:', error);
        }
    };

    // const handleChangeUser = (userId) => {
    //     setSelectedUserId(userId);
    //     setSelectedPost(null);
    // };

    return (

        <div className={styles.container}>
            <div className={styles.topBar}>
                {/* <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.userSelect}>
                    <label>Select User: </label>
                    <select
                        className={styles.select}
                        value={selectedUserId}
                        onChange={(e) => handleChangeUser(e.target.value)}
                    >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div> */}
            </div>
            <h1 className={styles.title}>Posts</h1>
            <div className={styles.newPost}>
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
            </div>
            <ul className={styles.postList}>

                {posts
                 .map((post, index) => (
                        <li key={post.post_id} className={styles.postItem}>
                            <div className={styles.postHeader}>
                                <span className={styles.post_title}>{post.post_id} - {post.title}</span>
                                <div className={styles.actions}>
                                    <button className={styles.button} onClick={() => setSelectedPost(post)}>View Post</button>
                                    <button className={styles.button} onClick={() => navigate(`/user/${userId}/post/${post.PostID}/comments`)}>Comments</button>
                                    {selectedUserId == userId && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeletePost(index, post.PostID)}
                                        ></button>
                                    )}
                                </div>
                            </div>
                            {selectedPost && selectedPost.post_id === post.post_id && (
                                <ViewPost
                                    post={post}
                                    index={index}
                                    setPosts={setPosts}
                                    posts={posts}
                                    setSelectedPost={setSelectedPost}
                                />
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Posts;