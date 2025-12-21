import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApiUtils from "../../../../utils/ApiUtils";
import styles from './ClassSearch.module.css';

const ClassSearch = ({ refreshKey }) => {
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setSearchParams] = useSearchParams();

  const limit = 10;

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiUtils.get(
        `${import.meta.env.VITE_API_URL

}/classes?limit=${limit}&offset=${page * limit}`
      );
      setClasses(res);
    } catch (err) {
      console.error("בעיה בשליפת שיעורים", err);
      setError("שגיאה בטעינת השיעורים");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page]);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchClasses();
    }
  }, [refreshKey]);

  const handleAction = (c, action) => {
    setSearchParams({
      classId: c.id,
      view: action,
      title: c.title,
    });
    setExpandedId(null);
  };

  const toggleExpanded = (classId) => {
    setExpandedId(expandedId === classId ? null : classId);
  };

  const formatDayOfWeek = (dayNumber) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return days[dayNumber] || '';
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>רשימת שיעורים</h3>

      {error && (
        <div className={styles.errorContainer}>
          {error}
          <button onClick={fetchClasses} className={styles.retryButton}>
            נסה שוב
          </button>
        </div>
      )}

      <div className={styles.listContainer}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>טוען שיעורים...</span>
          </div>
        )}

        <ul className={styles.classList}>
          {classes.length > 0 ? (
            classes.map((c) => (
              <li
                key={c.id}
                className={styles.classItem}
                onClick={() => toggleExpanded(c.id)}
              >
                <div className={styles.classContent}>
                  <div className={styles.classHeader}>
                    <div className={styles.classInfo}>
                      <div className={styles.classTitle}>{c.title}</div>
                      <div className={styles.classDetails}>
                        <span className={styles.classType}>{c.class_types}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.classDay}>{formatDayOfWeek(c.day_of_week)}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.classTime}>{c.start_time}-{c.end_time}</span>
                      </div>
                      <div className={styles.classDate}>
                        📅 {new Date(c.date_start).toLocaleDateString("he-IL")}
                      </div>
                    </div>
                    <span className={styles.expandIcon}>
                      {expandedId === c.id ? "▼" : "▶"}
                    </span>
                  </div>

                  {expandedId === c.id && (
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.button} ${styles.participantsButton}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(c, "participants");
                        }}
                      >
                        👥 הצג משתתפים
                      </button>
                      <button
                        className={`${styles.button} ${styles.deleteButton}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(c, "delete");
                        }}
                      >
                        🗑️ מחק שיעור
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className={styles.emptyState}>
              {loading ? "טוען..." : "לא נמצאו שיעורים"}
            </li>
          )}
        </ul>
      </div>

      <div className={styles.pagination}>
        <button
          disabled={page === 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className={styles.paginationButton}
        >
          ← קודם
        </button>

        <span className={styles.pageInfo}>עמוד {page + 1}</span>

        <button
          disabled={classes.length < limit || loading}
          onClick={() => setPage((p) => p + 1)}
          className={styles.paginationButton}
        >
          הבא →
        </button>
      </div>

      {classes.length > 0 && (
        <div className={styles.resultsInfo}>
          מוצגים {classes.length} שיעורים
        </div>
      )}
    </div>
  );
};

export default ClassSearch;
