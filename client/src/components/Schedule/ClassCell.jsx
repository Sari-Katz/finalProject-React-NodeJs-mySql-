
import React from "react";
import styles from "./ScheduleTable.module.css";

export default function CourseCell({ course, onClick, isClickable = true }) {
  const cellClasses = [
    styles.cell,
    !course && styles.emptyCell,
    course && isClickable && styles.clickableCell,
    course && !isClickable && styles.disabledCell
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (course && isClickable && onClick) {
      onClick();
    }
  };

  if (!course) {
    return (
      <div className={cellClasses}>
        <div className={styles.emptyCellContent}>
          <span>------</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cellClasses} onClick={handleClick}>
      <div className={styles.courseContent}>
        <div className={styles.courseTitle}>{course.title}</div>
        <div className={styles.courseType}>{course.class_types}</div>
        <div className={styles.courseTime}>
          {course.start_time} - {course.end_time}
        </div>
        {!isClickable && (
          <div className={styles.courseStatus}>נדרש מנוי</div>
        )}
      </div>
    </div>
  );
}