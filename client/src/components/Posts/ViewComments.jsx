import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../AuthContext";
import ApiService from '../../utils/ApiUtils';
import { useParams, useNavigate } from "react-router-dom";
import styles from './Posts.module.css';

function ViewComments() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [userDetails, setUserDetails] = useState({ userEmail: "", userName: "" });
    const [newCommentBody, setNewCommentBody] = useState("");
    const [editedCommentIndex, setEditedCommentIndex] = useState(null);
    const [editedCommentBody, setEditedCommentBody] = useState("");
    const { user } = useContext(AuthContext);
    const apiService = new ApiService();

    useEffect(() => {
   
            fetchComments(postId);
            findUserDetails();

    },[]);

    const fetchComments = async (postId) => {
        try {
            const data = await apiService.get(`http://localhost:3000/comments/${postId}`);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const findUserDetails = async () => {
        try {
            const data = await apiService.get(`http://localhost:3000/users/${user.id}`);
            console.log(data);
            if (data)
                setUserDetails({ userEmail: data.email, userName: data.name });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleAddComment = async (postId, commentBody) => {
        if (commentBody.trim()) {
            const newComment = {
                post_id: postId,
                // name: userDetails.userName,
                // email: userDetails.userEmail,
                user_id: user.id,
                content: commentBody,
            };

            try {
                const comment = await apiService.post('http://localhost:3000/comments', newComment)
                setComments([...comments, comment]);
                setNewCommentBody("")
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleDeleteComment = async (index) => {
        const commentId = comments[index].CommentID;
        try {
            await apiService.delete(`http://localhost:3000/comments/${commentId}`);
            const updatedComments = [...comments];
            updatedComments.splice(index, 1);
            setComments(updatedComments);
        } catch (error) {
            console.error('Error deleting comment:', error);
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
                const response = await apiService.put(`http://localhost:3000/comments/${commentId}`, updatedComment);
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

    return (
        <div className={styles.container}>
            <button className={styles.back} onClick={() => { navigate(`/posts`) }}>Back To Posts</button>
            <h4 className={styles.title}>Comments</h4>
            <ul className={styles.commentList}>
                {comments.map((comment, index) => (
                    <li key={comment.comment_id} className={styles.commentItem}>
                        <p><strong>Name:</strong> {comment.full_name}</p>
                        <p><strong>Email:</strong> {comment.email}</p>
                        <p><strong>Comment:</strong> {comment.content}</p>
                        {comment.mail === userDetails.userEmail && (
                            <div className={styles.actions}>
                                <span
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteComment(index)}
                                >
                                </span>
                                <button
                                    className={styles.editButton}
                                    onClick={() => {
                                        setEditedCommentIndex(index);
                                        setEditedCommentBody(comment.content);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {editedCommentIndex !== null && (
                <div className={styles.editSection}>
                    <h4>Edit Comment</h4>
                    <textarea
                        className={styles.textarea}
                        value={editedCommentBody}
                        onChange={(e) => setEditedCommentBody(e.target.value)}
                    />
                    <button
                        className={styles.saveButton}
                        onClick={() => handleEditComment(editedCommentIndex, editedCommentBody)}
                    >
                        Save
                    </button>
                </div>
            )}

            <div className={styles.addCommentSection}>
                <textarea
                    className={styles.textarea}
                    placeholder="Add a comment"
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                />
                <button
                    className={styles.addButton}
                    onClick={() => handleAddComment(postId, newCommentBody)}
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
}

export default ViewComments;