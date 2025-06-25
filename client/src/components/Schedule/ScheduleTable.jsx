import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import SubscriptionList from "../Subscription/SubscriptionList";
import CourseSignupModal from "./ClassSignupModal";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./ScheduleTable.module.css";
import CourseCell from "./ClassCell";
const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

export default function ScheduleTable() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSubscriptionList, setShowSubscriptionList] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const times = [...new Set(courses.map((c) => c.start_time))].sort();

  useEffect(() => {
    async function loadCourses() {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const data = await ApiUtils.get(`http://localhost:3000/classes?week=${currentDate}`);
        setCourses(data);
      } catch (err) {
        console.error("שגיאה בטעינת קורסים:", err);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserSubscription() {
      try {
      const { isActive } = await ApiUtils.get(
          `http://localhost:3000/subscription/user/isActive`
        );
        setActiveSubscription(isActive);
      } catch (err) {
        console.error("שגיאה בטעינת מנוי המשתמש:", err);
      }
    }

    fetchUserSubscription();
  }, [userId, user]);

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
