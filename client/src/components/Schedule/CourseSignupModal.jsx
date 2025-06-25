
// import React, { useEffect, useState } from "react";
// import styles from "./CourseSignupModal.module.css";
// import ApiUtilsUtils from "../../utils/ApiUtils";

// const api = new ApiUtils();

// export default function CourseSignupModal({ course, onClose }) {
//   const [status, setStatus] = useState("loading");
//   const [isRegistered, setIsRegistered] = useState(false);

//   useEffect(() => {
//     const checkRegistration = async () => {
//       try {
//         const res = await api.get(`http://localhost:3000/users/classes_participants/${course.id}/isRegistered`);
//         setIsRegistered(res);
//         setStatus("idle");
//       } catch (err) {
//         console.error("שגיאה בבדיקת הרשמה:", err);
//         setStatus("error");
//       }
//     };
//     checkRegistration();
//   }, [course.id]);

//   const handleSignup = async () => {
//     setStatus("signingUp");
//     try {
//       await api.post(`http://localhost:3000/users/classes_participants/${course.id}/register`);
//       setStatus("success");
//       setIsRegistered(true);
//     } catch (err) {
//       console.error("שגיאה בהרשמה:", err);
//       setStatus("error");
//     }
//   };

//   const handleUnregister = async () => {
//     setStatus("canceling");
//     try {
//       await api.post(`http://localhost:3000/users/classes_participants/${course.id}/unregister`);
//       setStatus("success");
//       setIsRegistered(false);
//     } catch (err) {
//       console.error("שגיאה בביטול הרשמה:", err);
//       setStatus("error");
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <button onClick={onClose} className={styles.closeButton}>×</button>

//         {status === "loading" && <div className={styles.spinner}>טוען...</div>}

//         {status === "idle" && (
//           <div>
//             <h3>{isRegistered ? "ביטול רישום לשיעור" : "רישום לשיעור"}</h3>
//             <p>שיעור: <strong>{course.title}</strong></p>
//             {isRegistered ? (
//               <button onClick={handleUnregister} className={styles.cancelBtn}>בטל הרשמה</button>
//             ) : (
//               <button onClick={handleSignup} className={styles.signupBtn}>הרשמה לשיעור</button>
//             )}
//           </div>
//         )}

//         {(status === "signingUp" || status === "canceling") && <div className={styles.spinner}>שולח בקשה...</div>}
//         {status === "success" && (
//           <div className={styles.successText}>
//             {isRegistered ? "נרשמת בהצלחה!" : "ההרשמה בוטלה בהצלחה"}
//             <br />
//             <button onClick={onClose}>סגור</button>
//           </div>
//         )}
//         {status === "error" && <div className={styles.errorText}>שגיאה בתהליך 😞</div>}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import styles from "./CourseSignupModal.module.css";
import ApiUtils from "../../utils/ApiUtils";

export default function CourseSignupModal({ course, onClose, onUpdate }) {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("loading");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        setStatus("loading");
        setError(null);
        const res = await ApiUtils.get(`http://localhost:3000/classes/${course.id}/isRegistered`);
        setIsRegistered(res);
      if (!user?.id) {
        setStatus("error");
        setError("משתמש לא מחובר");
      }}
      catch (err) {
        console.error("שגיאה בבדיקת הרשמה:", err);
        setError("שגיאה בבדיקת סטטוס ההרשמה");
        setStatus("error");
      }
    };

    checkRegistration();
  }, [course.id, user?.id]);

  const handleSignup = async () => {
    setStatus("signingUp");
    setError(null);
    
    try {
      await ApiUtils.post(`http://localhost:3000/classes/${course.id}/register`);
      setStatus("success");
      setIsRegistered(true);
      setStatus("success");
      
      // עדכן את רשימת הקורסים ברכיב האב
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("שגיאה בהרשמה:", err);
      setError(err.response?.data?.message || "שגיאה בהרשמה לקורס");
      setStatus("idle");
    }
  };

  const handleUnregister = async () => {
    setStatus("canceling");
    setError(null);
    
    try {
      await ApiUtils.post(`http://localhost:3000/classes/${course.id}/unregister`);
      setStatus("success");
      await ApiUtils.post(`http://localhost:3000/users/classes_participants/${course.id}/unregister`);
      setIsRegistered(false);
      setStatus("success");
      
      // עדכן את רשימת הקורסים ברכיב האב
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("שגיאה בביטול הרשמה:", err);
      setError(err.response?.data?.message || "שגיאה בביטול ההרשמה");
      setStatus("idle");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={styles.closeButton}>
          ×
        </button>

        <div className={styles.modalHeader}>
          <h3>{isRegistered ? "ביטול רישום לשיעור" : "רישום לשיעור"}</h3>
        </div>

        <div className={styles.courseDetails}>
          <div className={styles.courseInfo}>
            <h4>{course.title}</h4>
            <p><strong>סוג:</strong> {course.class_types}</p>
            <p><strong>זמן:</strong> {course.start_time} - {course.end_time}</p>
            <p><strong>תאריך:</strong> {formatDate(course.date_start)}</p>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className={styles.modalActions}>
          {status === "loading" && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <span>בודק סטטוס הרשמה...</span>
            </div>
          )}

          {status === "idle" && (
            <>
              {isRegistered ? (
                <div className={styles.registeredState}>
                  <div className={styles.statusBadge}>
                    ✅ רשום לשיעור
                  </div>
                  <button 
                    onClick={handleUnregister} 
                    className={styles.cancelButton}
                  >
                    בטל הרשמה
                  </button>
                </div>
              ) : (
                <div className={styles.notRegisteredState}>
                  <div className={styles.statusBadge}>
                    📅 לא רשום
                  </div>
                  <button 
                    onClick={handleSignup} 
                    className={styles.signupButton}
                  >
                    הירשם לשיעור
                  </button>
                </div>
              )}
            </>
          )}

          {(status === "signingUp" || status === "canceling") && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <span>
                {status === "signingUp" ? "מבצע הרשמה..." : "מבטל הרשמה..."}
              </span>
            </div>
          )}

          {status === "success" && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>🎉</div>
              <p className={styles.successMessage}>
                {isRegistered ? "נרשמת בהצלחה לשיעור!" : "ההרשמה בוטלה בהצלחה"}
              </p>
              <button onClick={handleClose} className={styles.doneButton}>
                סגור
              </button>
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorState}>
              <p>שגיאה בטעינת פרטי השיעור</p>
              <button onClick={handleClose} className={styles.doneButton}>
                סגור
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}