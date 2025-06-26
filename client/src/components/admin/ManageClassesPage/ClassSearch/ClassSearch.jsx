// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import ApiUtils from "../../../../utils/ApiUtils";

// const ClassSearch = ({ refreshKey }) => {
//   const [classes, setClasses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [expandedId, setExpandedId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const limit = 10;

//   const fetchClasses = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await ApiUtils.get(
//         `http://localhost:3000/classes?limit=${limit}&offset=${page * limit}`
//       );
//       setClasses(res);
//     } catch (err) {
//       console.error("בעיה בשליפת שיעורים", err);
//       setError("שגיאה בטעינת השיעורים");
//       setClasses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, [page]);

//   useEffect(() => {
//     if (refreshKey > 0) {
//       fetchClasses();
//     }
//   }, [refreshKey]);

//   const handleAction = (c, action) => {
//     setSearchParams({
//       classId: c.id,
//       view: action,
//       title: c.title,
//     });
//     setExpandedId(null);
//   };

//   const toggleExpanded = (classId) => {
//     setExpandedId(expandedId === classId ? null : classId);
//   };

//   return (
//     <div className="space-y-3">
//       <h3 className="font-semibold text-lg">רשימת שיעורים</h3>

//       {error && (
//         <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
//           {error}
//           <button
//             onClick={fetchClasses}
//             className="mr-2 text-blue-600 underline"
//           >
//             נסה שוב
//           </button>
//         </div>
//       )}

//       <div className="relative">
//         {loading && (
//           <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//             <span className="text-gray-600">טוען...</span>
//           </div>
//         )}

//         <ul className="divide-y border rounded max-h-60 overflow-auto">
//           {classes.length > 0 ? (
//             classes.map((c) => (
//               <li
//                 key={c.id}
//                 className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
//                 onClick={() => toggleExpanded(c.id)}
//               >
//                 <div className="flex flex-col gap-2">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <span className="font-medium">{c.title}</span>
//                       <div className="text-sm text-gray-600">
//                         {c.class_types} • {c.day_of_week} • {c.start_time}-{c.end_time}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(c.date_start).toLocaleDateString("he-IL")}
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-400">
//                       {expandedId === c.id ? "▼" : "▶"}
//                     </span>
//                   </div>

//                   {expandedId === c.id && (
//                     <div className="flex gap-2 pt-2 border-t">
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAction(c, "participants");
//                         }}
//                       >
//                         הצג משתתפים
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAction(c, "delete");
//                         }}
//                       >
//                         מחק שיעור
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="p-3 text-gray-500 text-center">
//               {loading ? "טוען..." : "לא נמצאו שיעורים"}
//             </li>
//           )}
//         </ul>
//       </div>

//       {/* פגינציה */}
//       <div className="flex justify-between items-center">
//         <button
//           disabled={page === 0 || loading}
//           onClick={() => setPage((p) => Math.max(0, p - 1))}
//           className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//         >
//           ← קודם
//         </button>

//         <span className="text-sm text-gray-600">עמוד {page + 1}</span>

//         <button
//           disabled={classes.length < limit || loading}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//         >
//           הבא →
//         </button>
//       </div>

//       {classes.length > 0 && (
//         <div className="text-xs text-gray-500 text-center">
//           מוצגים {classes.length} שיעורים
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassSearch;
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
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiUtils.get(
        `http://localhost:3000/classes?limit=${limit}&offset=${page * limit}`
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
