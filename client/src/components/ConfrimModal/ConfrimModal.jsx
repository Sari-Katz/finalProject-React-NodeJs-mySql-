import React from 'react';
import styles from './ConfirmModal.module.css';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalIcon}>
                    🗑️
                </div>
                <h3 className={styles.modalTitle}>{title}</h3>
                <p className={styles.modalMessage}>
                    {message}
                </p>
                <div className={styles.modalActions}>
                    <button 
                        className={styles.confirmButton}
                        onClick={onConfirm}
                    >
                        כן, מחק
                    </button>
                    <button 
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        בטל
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;