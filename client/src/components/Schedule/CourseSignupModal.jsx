
import React, { useEffect, useState } from "react";
import styles from "./CourseSignupModal.module.css";
import ApiUtils from "../../utils/ApiUtils";

const api = new ApiUtils();

export default function CourseSignupModal({ course, onClose }) {
  const [status, setStatus] = useState("loading");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await api.get(`http://localhost:3000/users/classes_participants/${course.id}/isRegistered`);
        setIsRegistered(res);
        setStatus("idle");
      } catch (err) {
        console.error("שגיאה בבדיקת הרשמה:", err);
        setStatus("error");
      }
    };
    checkRegistration();
  }, [course.id]);

  const handleSignup = async () => {
    setStatus("signingUp");
    try {
      await api.post(`http://localhost:3000/users/classes_participants/${course.id}/register`);
      setStatus("success");
      setIsRegistered(true);
    } catch (err) {
      console.error("שגיאה בהרשמה:", err);
      setStatus("error");
    }
  };

  const handleUnregister = async () => {
    setStatus("canceling");
    try {
      await api.post(`http://localhost:3000/users/classes_participants/${course.id}/unregister`);
      setStatus("success");
      setIsRegistered(false);
    } catch (err) {
      console.error("שגיאה בביטול הרשמה:", err);
      setStatus("error");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>×</button>

        {status === "loading" && <div className={styles.spinner}>טוען...</div>}

        {status === "idle" && (
          <div>
            <h3>{isRegistered ? "ביטול רישום לשיעור" : "רישום לשיעור"}</h3>
            <p>שיעור: <strong>{course.title}</strong></p>
            {isRegistered ? (
              <button onClick={handleUnregister} className={styles.cancelBtn}>בטל הרשמה</button>
            ) : (
              <button onClick={handleSignup} className={styles.signupBtn}>הרשמה לשיעור</button>
            )}
          </div>
        )}

        {(status === "signingUp" || status === "canceling") && <div className={styles.spinner}>שולח בקשה...</div>}
        {status === "success" && (
          <div className={styles.successText}>
            {isRegistered ? "נרשמת בהצלחה!" : "ההרשמה בוטלה בהצלחה"}
            <br />
            <button onClick={onClose}>סגור</button>
          </div>
        )}
        {status === "error" && <div className={styles.errorText}>שגיאה בתהליך 😞</div>}
      </div>
    </div>
  );
}
