import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ScheduleTable.module.css";
import CourseCell from "./CourseCell";
import CourseSignupModal from "./CourseSignupModal";
import ApiUtils from "../../utils/ApiUtils";
import Nav from "../Nav/Nav";

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

export default function ScheduleTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiUtils = new ApiUtils();

  const times = [...new Set(courses.map((c) => c.start_time))].sort();

  useEffect(() => {
    async function loadCourses() {
      try {
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const data = await apiUtils.get(`http://localhost:3000/classes?week=${currentDate}`);
        console.log(data)
        setCourses(data);
      } catch (err) {
        console.error("שגיאה בטעינת קורסים:", err);
      }
    }
    loadCourses();
  }, []);

  // בדיקה אם יש courseId ב-URL
  useEffect(() => {
    const courseId = searchParams.get("signup");
    if (courseId && courses.length > 0) {
      const course = courses.find((c) => c.id.toString() === courseId);
      if (course) setSelectedCourse(course);
    }
  }, [courses, searchParams]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setSearchParams({ signup: course.id });
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setSearchParams({});
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

        {selectedCourse && (
          <CourseSignupModal course={selectedCourse} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}
