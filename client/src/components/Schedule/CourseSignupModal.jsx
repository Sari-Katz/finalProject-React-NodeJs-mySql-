import React, { useState } from "react";
import styles from "./CourseSignupModal.module.css";
import ApiUtils from "../../utils/ApiUtils";

const api = new ApiUtils();

export default function CourseSignupModal({ course, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSignup = async () => {
    setStatus("loading");
    try {
      await api.post("http://localhost:3000/classes_participants", {
        courseId: course.id,
      });
      setStatus("success");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("שגיאה בהרשמה:", err);
      setStatus("error");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>×</button>

        {status === "idle" && (
          <div>
            <h3>רישום לשיעור</h3>
            <p>לשיעור: <strong>{course.title}</strong></p>
            <p>כדי להירשם לחץ על הכפתור למטה</p>
            <button onClick={handleSignup}>הרשמה לשיעור</button>
          </div>
        )}

        {status === "loading" && <div className={styles.spinner}></div>}
        {status === "success" && <div className={styles.checkmark}>✓ נרשמת בהצלחה!</div>}
        {status === "error" && <div className={styles.errorText}>שגיאה בהרשמה 😞</div>}
      </div>
    </div>
  );
}
