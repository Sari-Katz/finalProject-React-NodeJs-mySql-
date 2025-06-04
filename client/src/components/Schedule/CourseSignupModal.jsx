import React, { useState, useEffect } from "react";
import styles from "./CourseSignupModal.module.css";
import ApiUtils from "../../utils/ApiUtils";

const api = new ApiUtils();

export default function CourseSignupModal({ course, onClose }) {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    const timer = setTimeout(() => {
      signupToCourse();
    }, 500); // אפשרות לעיכוב קצר להדמיה

    return () => clearTimeout(timer);
  }, []);

  async function signupToCourse() {
    try {
      await api.post("/api/signup", { courseId: course.id });
      setStatus("success");

      // סגור את המודאל אחרי 2 שניות
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("שגיאה בהרשמה:", err);
      setStatus("error");
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {status === "loading" && <div className={styles.spinner}></div>}
        {status === "success" && <div className={styles.checkmark}>✓</div>}
        {status === "error" && <div className={styles.errorText}>שגיאה בהרשמה</div>}
      </div>
    </div>
  );
}
