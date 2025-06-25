import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApiUtils from "../../../utils/ApiUtils";
import styles from './ChallengeSearch.module.css';

const ChallengeSearch = ({ refreshKey }) => {
  const [challenges, setChallenges] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiUtils.get(
        `http://localhost:3000/challenges?limit=${limit}&offset=${page * limit}`
      );
      setChallenges(res);
    } catch (err) {
      console.error("שגיאה בטעינת אתגרים", err);
      setError("בעיה בטעינת האתגרים");
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page]);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchChallenges();
    }
  }, [refreshKey]);

  const handleAction = (c, action) => {
    if (action === "participants") {
      setSearchParams({
        challengeId: c.id,
        view: "participants",
        description: c.description,
      });
    } else if (action === "delete") {
      setSearchParams({
        challengeId: c.id,
        view: "delete",
        description: c.description,
      });
    }
    setExpandedId(null);
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>רשימת אתגרים</h3>

      {error && (
        <div className={styles.errorContainer}>
          {error}
          <button onClick={fetchChallenges} className={styles.retryButton}>
            נסה שוב
          </button>
        </div>
      )}

      <ul className={styles.challengesList}>
        {challenges.length > 0 ? (
          challenges.map((c) => (
            <li
              key={c.id}
              className={styles.challengeItem}
              onClick={() => toggleExpanded(c.id)}
            >
              <div className={styles.challengeContent}>
                <div className={styles.challengeHeader}>
                  <span className={styles.challengeDescription}>{c.description}</span>
                  <span className={styles.expandIcon}>
                    {expandedId === c.id ? "▼" : "▶"}
                  </span>
                </div>

                {expandedId === c.id && (
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.participantsButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(c, "participants");
                      }}
                    >
                      הצג משתתפים
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(c, "delete");
                      }}
                    >
                      מחק אתגר
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className={styles.emptyState}>
            {loading ? "טוען..." : "לא נמצאו אתגרים"}
          </li>
        )}
      </ul>

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
          disabled={challenges.length < limit || loading}
          onClick={() => setPage((p) => p + 1)}
          className={styles.paginationButton}
        >
          הבא →
        </button>
      </div>

      {challenges.length > 0 && (
        <div className={styles.resultsInfo}>
          מוצגים {challenges.length} אתגרים
        </div>
      )}
    </div>
  );
};

export default ChallengeSearch;