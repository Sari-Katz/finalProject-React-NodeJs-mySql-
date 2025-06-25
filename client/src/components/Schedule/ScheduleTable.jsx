import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";  // נתיב מדויק לפי המיקום שלך
import SubscriptionList from "../Subscription/SubscriptionList";
import CourseSignupModal from "./CourseSignupModal";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./ScheduleTable.module.css";
import CourseCell from "./CourseCell";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

export default function ScheduleTable() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [activeSubscription, setActiveSubscription] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSubscriptionList, setShowSubscriptionList] = useState(false);
  // const [me, setMe] = useState(null); // לפרטי המשתמש עם מנוי פעיל
  const [searchParams, setSearchParams] = useSearchParams();

  const apiUtils = new ApiUtils();

  const times = [...new Set(courses.map((c) => c.start_time))].sort();

  // טען קורסים
  useEffect(() => {
    async function loadCourses() {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const data = await apiUtils.get(`http://localhost:3000/classes?week=${currentDate}`);
        setCourses(data);
      } catch (err) {
        console.error("שגיאה בטעינת קורסים:", err);
      }
    }
    loadCourses();
  }, []);

  // טען פרטי משתמש עם מנוי פעיל ברגע שיש userId
  useEffect(() => {
    if (!userId) return;

    async function fetchUserSubscription() {
      try {
        const subscriptionData = await apiUtils.get(
          `http://localhost:3000/userSubscription/byUser/${userId}`
        );
        setActiveSubscription(subscriptionData.isActive);

      } catch (err) {
        console.error("שגיאה בטעינת מנוי המשתמש:", err);
      }
    }

    fetchUserSubscription();
  }, [userId, user]);

  // בדיקת פרמטר URL כדי לפתוח מודאל קורס
  useEffect(() => {
    const courseId = searchParams.get("signup");
    if (courseId && courses.length > 0) {
      const course = courses.find((c) => c.id.toString() === courseId);
      if (course) setSelectedCourse(course);
    }
  }, [courses, searchParams]);

  const openModal = (course) => {

    if (!activeSubscription) {
      setShowSubscriptionList(true);
      setSelectedCourse(null);
      setSearchParams({});
      return;
    }
    setSelectedCourse(course);
    setSearchParams({ signup: course.id });
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setSearchParams({});
  };

  const closeSubscriptionList = () => {
    setShowSubscriptionList(false);
  };

  return (
    <div>
      <div className={`${styles.scheduleContainer} ${styles.centeredContent}`} dir="rtl">
        <div className={`${styles.cell} ${styles.header}`}>שעה</div>
        {days.map((day) => (
          <div key={day} className={`${styles.cell} ${styles.dayHeader}`}>
            {day}
          </div>
        ))}
        {times.map((time) => (
          <React.Fragment key={time}>
            <div className={`${styles.cell} ${styles.timeCell}`}>{time}</div>
            {days.map((day) => {
              const course = courses.find(
                (c) => c.day_of_week === day && c.start_time === time
              );
              return (
                <CourseCell
                  key={`${day}-${time}`}
                  course={course}
                  onClick={() => course && openModal(course)}
                />
              );
            })}
          </React.Fragment>
        ))}

        {selectedCourse && !showSubscriptionList && (
          <CourseSignupModal course={selectedCourse} onClose={closeModal} />
        )}
      </div>

      {showSubscriptionList && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeSubscriptionList}>×</button>

            <div> אין לך מנוי בתוקף לחידוש המנוי בחר את החבילה הרצויה</div>

            <SubscriptionList />
          </div>
        </div>
      )}
    </div>
  );
}
// import React, { useEffect, useState, useContext } from "react";
// import { useSearchParams } from "react-router-dom";
// import { AuthContext } from "../AuthContext";
// import SubscriptionList from "../Subscription/SubscriptionList";
// import CourseSignupModal from "./CourseSignupModal";
// import ApiUtils from "../../utils/ApiUtils";
// import styles from "./ScheduleTable.module.css";
// import CourseCell from "./CourseCell";

// const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

// export default function ScheduleTable() {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id;

//   const [activeSubscription, setActiveSubscription] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showSubscriptionList, setShowSubscriptionList] = useState(false);

//   const [searchParams, setSearchParams] = useSearchParams();
//   const apiUtils = new ApiUtils();

//   const times = [...new Set(courses.map((c) => c.start_time))].sort();

//   /* ─────────────────────────────── קורסים ─────────────────────────────── */
//   useEffect(() => {
//     async function loadCourses() {
//       try {
//         const currentDate = new Date().toISOString().split("T")[0];
//         const data = await apiUtils.get(`http://localhost:3000/classes/week/${currentDate}`);
//         setCourses(data);
//       } catch (err) {
//         console.error("שגיאה בטעינת קורסים:", err);
//       }
//     }
//     loadCourses();
//   }, []);

//   /* ───────────────────── מנוי פעיל (משתמש) ───────────────────── */
//   useEffect(() => {
//     if (!userId) return;

//     async function fetchUserSubscription() {
//       try {
//         const { isActive } = await apiUtils.get(
//           `http://localhost:3000/userSubscription/byUser/${userId}`
//         );
//         setActiveSubscription(isActive);
//       } catch (err) {
//         console.error("שגיאה בטעינת מנוי המשתמש:", err);
//       }
//     }

//     fetchUserSubscription();
//   }, [userId]);

//   /* ───────────────────── פתח מודאל קורס לפי פרמטר signup ───────────────────── */
//   useEffect(() => {
//     const courseId = searchParams.get("signup");
//     if (courseId && courses.length > 0) {
//       const course = courses.find((c) => c.id.toString() === courseId);
//       if (course) setSelectedCourse(course);
//     }
//   }, [courses, searchParams]);

//   /* ───────────────────── בדיקה אוטומטית לפרמטר subscription ───────────────────── */
//   useEffect(() => {
//     if (searchParams.get("subscription") === "true") {
//       setShowSubscriptionList(true);
//     }
//   }, [searchParams]);

//   /* ───────────────────── פונקציות עזר למודאלים ───────────────────── */
//   const openSubscriptionModal = () => {
//     setShowSubscriptionList(true);
//     setSelectedCourse(null);
//     setSearchParams({ subscription: "true" });
//   };

//   const closeSubscriptionModal = () => {
//     setShowSubscriptionList(false);
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("subscription");
//     setSearchParams(params);
//   };

//   const openCourseModal = (course) => {
//     setSelectedCourse(course);
//     setSearchParams({ signup: course.id });
//   };

//   const closeCourseModal = () => {
//     setSelectedCourse(null);
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("signup");
//     setSearchParams(params);
//   };

//   /* ───────────────────── לחיצה על תא קורס ───────────────────── */
//   const handleCellClick = (course) => {
//     if (!activeSubscription) {
//       openSubscriptionModal();
//       return;
//     }
//     openCourseModal(course);
//   };

//   /* ─────────────────────────────── UI ─────────────────────────────── */
//   return (
//     <div>
//       <div className={`${styles.scheduleContainer} ${styles.centeredContent}`} dir="rtl">
//         <div className={`${styles.cell} ${styles.header}`}>שעה</div>
//         {days.map((day) => (
//           <div key={day} className={`${styles.cell} ${styles.dayHeader}`}>
//             {day}
//           </div>
//         ))}
//         {times.map((time) => (
//           <React.Fragment key={time}>
//             <div className={`${styles.cell} ${styles.timeCell}`}>{time}</div>
//             {days.map((day) => {
//               const course = courses.find(
//                 (c) => c.day_of_week === day && c.start_time === time
//               );
//               return (
//                 <CourseCell
//                   key={`${day}-${time}`}
//                   course={course}
//                   onClick={() => course && handleCellClick(course)}
//                 />
//               );
//             })}
//           </React.Fragment>
//         ))}

//         {/* מודאל הרשמה לקורס */}
//         {selectedCourse && !showSubscriptionList && (
//           <CourseSignupModal course={selectedCourse} onClose={closeCourseModal} />
//         )}
//       </div>

//       {/* מודאל חבילות מנוי */}
//       {showSubscriptionList && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <button onClick={closeSubscriptionModal}>×</button>
//             <div>אין לך מנוי בתוקף. לחידוש המנוי בחר את החבילה הרצויה:</div>
//             <SubscriptionList />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useEffect, useState, useContext } from "react";
// import { useSearchParams } from "react-router-dom";
// import { AuthContext } from "../AuthContext";
// import SubscriptionList from "../Subscription/SubscriptionList";
// import CourseSignupModal from "./CourseSignupModal";
// import ApiUtils from "../../utils/ApiUtils";
// import styles from "./ScheduleTable.module.css";
// import CourseCell from "./CourseCell";

// const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
// const DAYS_EN = [1, 2, 3, 4, 5]; // מיפוי ליום בשבוע

// export default function ScheduleTable() {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id;

//   const [activeSubscription, setActiveSubscription] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showSubscriptionList, setShowSubscriptionList] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [searchParams, setSearchParams] = useSearchParams();
//   const apiUtils = new ApiUtils();

//   // מיון שעות
//   const times = [...new Set(courses.map((c) => c.start_time))].sort();

//   /* ─────────────────────────────── טעינת קורסים ─────────────────────────────── */
//   useEffect(() => {
//     async function loadCourses() {
//       try {
//         setLoading(true);
//         setError(null);
//         const currentDate = new Date().toISOString().split("T")[0];
//         const data = await apiUtils.get(`http://localhost:3000/classes?week=${currentDate}`);
//         setCourses(data || []);
//       } catch (err) {
//         console.error("שגיאה בטעינת קורסים:", err);
//         setError("שגיאה בטעינת הקורסים");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadCourses();
//   }, [refreshKey]);

//   /* ───────────────────── בדיקת מנוי פעיל ───────────────────── */
//   useEffect(() => {
//     if (!userId) {
//       setActiveSubscription(false);
//       return;
//     }

//     async function fetchUserSubscription() {
//       try {
//         const response = await apiUtils.get(
//           `http://localhost:3000/userSubscription/byUser/${userId}`
//         );
//         setActiveSubscription(response?.isActive || false);
//       } catch (err) {
//         console.error("שגיאה בטעינת מנוי המשתמש:", err);
//         setActiveSubscription(false);
//       }
//     }

//     fetchUserSubscription();
//   }, [userId]);

//   /* ───────────────────── טיפול ב-URL parameters ───────────────────── */
//   useEffect(() => {
//     const courseId = searchParams.get("signup");
//     const showSub = searchParams.get("subscription");

//     if (showSub === "true") {
//       setShowSubscriptionList(true);
//       setSelectedCourse(null);
//     } else if (courseId && courses.length > 0) {
//       const course = courses.find((c) => c.id.toString() === courseId);
//       if (course) {
//         setSelectedCourse(course);
//         setShowSubscriptionList(false);
//       }
//     } else {
//       setSelectedCourse(null);
//       setShowSubscriptionList(false);
//     }
//   }, [courses, searchParams]);

//   /* ───────────────────── פונקציות עזר ───────────────────── */
//   const updateURL = (params) => {
//     const newParams = new URLSearchParams(searchParams.toString());
//     Object.entries(params).forEach(([key, value]) => {
//       if (value === null || value === undefined) {
//         newParams.delete(key);
//       } else {
//         newParams.set(key, value);
//       }
//     });
//     setSearchParams(newParams);
//   };

//   const openSubscriptionModal = () => {
//     updateURL({ subscription: "true", signup: null });
//   };

//   const closeSubscriptionModal = () => {
//     updateURL({ subscription: null });
//   };

//   const openCourseModal = (course) => {
//     updateURL({ signup: course.id, subscription: null });
//   };

//   const closeCourseModal = () => {
//     updateURL({ signup: null });
//   };

//   const refreshCourses = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   /* ───────────────────── טיפול בלחיצה על תא ───────────────────── */
//   const handleCellClick = (course) => {
//     if (!user) {
//       alert("יש להתחבר כדי להירשם לשיעורים");
//       return;
//     }

//     if (!activeSubscription) {
//       openSubscriptionModal();
//       return;
//     }

//     openCourseModal(course);
//   };

//   /* ───────────────────── מיפוי יום בשבוע ───────────────────── */
//   const getDayName = (dayNumber) => {
//     const dayIndex = DAYS_EN.indexOf(dayNumber);
//     return dayIndex !== -1 ? DAYS_HE[dayIndex] : "";
//   };

//   /* ─────────────────────────────── רינדר ─────────────────────────────── */
//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}>טוען לוח זמנים...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <p>{error}</p>
//         <button onClick={refreshCourses} className={styles.retryButton}>
//           נסה שוב
//         </button>
//       </div>
//     );
//   }

//   if (courses.length === 0) {
//     return (
//       <div className={styles.emptyContainer}>
//         <p>אין שיעורים השבוע</p>
//         <button onClick={refreshCourses} className={styles.refreshButton}>
//           רענן
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.scheduleWrapper}>
//       <div className={styles.scheduleHeader}>
//         <h2>לוח שיעורים שבועי</h2>
//         {!user && (
//           <div className={styles.loginPrompt}>
//             יש להתחבר כדי להירשם לשיעורים
//           </div>
//         )}
//         {user && !activeSubscription && (
//           <div className={styles.subscriptionPrompt}>
//             <span>אין לך מנוי פעיל.</span>
//             <button onClick={openSubscriptionModal} className={styles.subscribeButton}>
//               רכוש מנוי
//             </button>
//           </div>
//         )}
//       </div>

//       <div className={styles.scheduleContainer} dir="rtl">
//         {/* כותרת עמודת שעות */}
//         <div className={`${styles.cell} ${styles.header}`}>שעה</div>
        
//         {/* כותרות ימים */}
//         {DAYS_HE.map((day) => (
//           <div key={day} className={`${styles.cell} ${styles.dayHeader}`}>
//             {day}
//           </div>
//         ))}

//         {/* שורות השעות והקורסים */}
//         {times.map((time) => (
//           <React.Fragment key={time}>
//             <div className={`${styles.cell} ${styles.timeCell}`}>
//               {time}
//             </div>
            
//             {DAYS_EN.map((dayNum, index) => {
//               const dayName = DAYS_HE[index];
//               const course = courses.find(
//                 (c) => c.day_of_week === dayNum && c.start_time === time
//               );
              
//               return (
//                 <CourseCell
//                   key={`${dayName}-${time}`}
//                   course={course}
//                   onClick={() => course && handleCellClick(course)}
//                   isClickable={!!course && !!user && !!activeSubscription}
//                 />
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* מודאל הרשמה לקורס */}
//       {selectedCourse && !showSubscriptionList && (
//         <CourseSignupModal 
//           course={selectedCourse} 
//           onClose={closeCourseModal}
//           onUpdate={refreshCourses}
//         />
//       )}

//       {/* מודאל רכישת מנוי */}
//       {showSubscriptionList && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <button onClick={closeSubscriptionModal} className={styles.closeButton}>
//               ×
//             </button>
//             <div className={styles.modalHeader}>
//               <h3>אין לך מנוי בתוקף</h3>
//               <p>לחידוש המנוי בחר את החבילה הרצויה:</p>
//             </div>
//             <SubscriptionList onSubscriptionUpdate={() => {
//               closeSubscriptionModal();
//               // רענן את סטטוס המנוי
//               if (userId) {
//                 apiUtils.get(`http://localhost:3000/userSubscription/byUser/${userId}`)
//                   .then(response => setActiveSubscription(response?.isActive || false))
//                   .catch(console.error);
//               }
//             }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }