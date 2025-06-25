import { useEffect, useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";
import styles from "./CompleteChallengeList.module.css"; 

const CompleteChallengeList = ({ challengeId, description, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const res = await ApiUtils.get(
          `http://localhost:3000/challenges/${challengeId}/completions`
        );
        setParticipants(res);
      } catch (err) {
        console.error("שגיאה בשליפת משתתפים", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [challengeId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          משתתפים באתגר: <span>{description}</span>
        </h4>
        <button onClick={onClose} className={styles.closeBtn}>
          סגור
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>טוען…</p>
      ) : participants.length ? (
        <ul className={styles.list}>
          {participants.map((p) => (
            <li key={p.id} className={styles.listItem}>
              {p.full_name} - {p.email}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>אין נרשמים לאתגר זה.</p>
      )}
    </div>
  );
};

export default CompleteChallengeList;
