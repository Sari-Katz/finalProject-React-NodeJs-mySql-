import React from "react";
import styles from "./ScheduleTable.module.css";

export default function CourseCell({ course, onClick }) {
  return (
    <div
      className={`${styles.cell} ${!course ? styles.empty : ""}`}
      onClick={course ? onClick : undefined}
    >
      {course ? (
        <>
          <div className={styles.courseTitle}>{course.title}</div>
          {course.description && <div className={styles.courseDescription}>{course.description}</div>}
        </>
      ) : (
        <div className={styles.emptyCell}>--------</div>
      )}
    </div>
  );
}
