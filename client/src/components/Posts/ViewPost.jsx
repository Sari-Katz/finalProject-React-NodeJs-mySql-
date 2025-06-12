
// import { useUserContext } from '../UserContext';
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import styles from './Posts.module.css';
import ApiService from '../../utils/ApiUtils';

function ViewPost(props) {
    const { post, index, setPosts, posts, setSelectedPost } = props;
    const [editPostBody, setEditPostBody] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { user} = useContext(AuthContext);
    const apiService = new ApiService();

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
                        <button onClick={() => handleUpdatePost(post.PostID, editPostBody)}>
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>{post.content}</p>
                        {(user.role=='admin') && (
                            <span className={styles.editIcon}
                                onClick={() => {
                                    setEditPostBody(post.Content);
                                    setIsEditing(true);
                                }}>
                            </span>
                        )}
                        <button onClick={() => setSelectedPost(null)}>Close</button>
                    </div>
                )}
            </div>
        </>
    );
}
export default ViewPost;