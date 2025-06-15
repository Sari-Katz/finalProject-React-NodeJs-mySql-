import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import styles from './Posts.module.css';
import ApiService from '../../utils/ApiUtils';

function ViewPost(props) {
    const { post, index, setPosts, posts, setSelectedPost } = props;
    const [editPostBody, setEditPostBody] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(AuthContext);
    const apiService = new ApiService();
    console.log(user)
    const handleUpdatePost = async (id, newBody) => {
        console.log(posts[index]);
        const updatedPost = { ...posts[index], content: newBody };
        try {
            const response = await apiService.put(`http://localhost:3000/posts/${id}`, updatedPost);
            console.log('Post updated:', response);
            const updatedPosts = [...posts];
            updatedPosts[index] = response;
            setPosts(updatedPosts);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <>
        
            <div>
                {isEditing ? (
                    <div>
                        <textarea
                            value={editPostBody}
                            onChange={(e) => setEditPostBody(e.target.value)}
                        />
                        <button onClick={() => handleUpdatePost(post.post_id, editPostBody)}>
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>{post.content}</p>
                        {(user.role == 'admin') && (
                            <span className={styles.editIcon}
                                onClick={() => {
                                    setEditPostBody(post.content);
                                    setIsEditing(true);
                                }}>
                            </span>
                        )}
                        <button
                            className={`${styles.closeBtn} ${styles.active}`}
                            onClick={() => setSelectedPost(null)}
                        >
                            סגור
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
export default ViewPost;