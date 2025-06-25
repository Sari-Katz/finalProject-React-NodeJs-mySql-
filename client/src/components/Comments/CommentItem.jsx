// import React, { useState, useContext } from 'react';
// import { AuthContext } from "../AuthContext";
// import styles from './Comments.module.css';

// function CommentItem({ comment, onEdit, onDelete }) {
//     const { user } = useContext(AuthContext);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editBody, setEditBody] = useState(comment.content);
//     const handleSave = () => {
//         if (editBody.trim()) {
//             onEdit(comment.comment_id, editBody);
//             setIsEditing(false);
//         }
//     };
//     const handleCancel = () => {
//         setEditBody(comment.content);
//         setIsEditing(false);
//     };

//     const handleDelete = () => {
//         if (window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) {
//             onDelete(comment.comment_id);
//         }
//     };

//     const canEdit = comment.email === user.email || user.role === 'admin';

//     return (
//         <div className={styles.commentItem}>
//             <div className={styles.commentHeader}>
//                 <div className={styles.commentAuthor}>
//                     <span className={styles.authorName}>👤 {comment.full_name}</span>
//                     <span className={styles.authorEmail}>{comment.email}</span>
//                 </div>
//                 {canEdit && (
//                     <div className={styles.commentActions}>
//                         <button
//                             className={styles.editCommentButton}
//                             onClick={() => setIsEditing(true)}
//                             disabled={isEditing}
//                         >
//                             ✏️
//                         </button>
//                         <button
//                             className={styles.deleteCommentButton}
//                             onClick={handleDelete}
//                         >
//                             🗑️
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <div className={styles.commentContent}>
//                 {isEditing ? (
//                     <div className={styles.editCommentSection}>
//                         <textarea
//                             className={styles.editCommentTextarea}
//                             value={editBody}
//                             onChange={(e) => setEditBody(e.target.value)}
//                             rows="3"
//                         />
//                         <div className={styles.editCommentActions}>
//                             <button
//                                 className={styles.saveCommentButton}
//                                 onClick={handleSave}
//                             >
//                                 💾 שמור
//                             </button>
//                             <button
//                                 className={styles.cancelCommentButton}
//                                 onClick={handleCancel}
//                             >
//                                 ❌ בטל
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <p className={styles.commentText}>{comment.content}</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default CommentItem;
import React, { useState, useContext } from 'react';
import { AuthContext } from "../AuthContext";
import ConfirmModal from '../ConfrimModal/ConfrimModal'; // 👈 הייבוא החדש
import styles from './Comments.module.css';

function CommentItem({ comment, onEdit, onDelete }) {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.content);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 state חדש

    const handleSave = () => {
        if (editBody.trim()) {
            onEdit(comment.comment_id, editBody);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditBody(comment.content);
        setIsEditing(false);
    };

    // 👇 הפונקציות החדשות
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(comment.comment_id);
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const canEdit = comment.email === user.email ;

    return (
        <>
            <div className={styles.commentItem}>
                <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor}>
                        <span className={styles.authorName}>👤 {comment.full_name}</span>
                        <span className={styles.authorEmail}>{comment.email}</span>
                    </div>
                    {canEdit && (
                        <div className={styles.commentActions}>
                            <button
                                className={styles.editCommentButton}
                                onClick={() => setIsEditing(true)}
                                disabled={isEditing}
                            >
                                ✏️
                            </button>
                            <button
                                className={styles.deleteCommentButton}
                                onClick={handleDeleteClick} // 👈 שינוי כאן
                            >
                                🗑️
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.commentContent}>
                    {isEditing ? (
                        <div className={styles.editCommentSection}>
                            <textarea
                                className={styles.editCommentTextarea}
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                rows="3"
                            />
                            <div className={styles.editCommentActions}>
                                <button
                                    className={styles.saveCommentButton}
                                    onClick={handleSave}
                                >
                                    💾 שמור
                                </button>
                                <button
                                    className={styles.cancelCommentButton}
                                    onClick={handleCancel}
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

            {/* 👇 החלונית החדשה - נפרדת וניתנת לשימוש חוזר */}
            <ConfirmModal 
                isOpen={showDeleteModal}
                title="מחק תגובה"
                message="האם אתה בטוח שברצונך למחוק את התגובה? פעולה זו אינה ניתנת לביטול"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </>
    );
}

export default CommentItem;