import React, { useEffect, useState } from "react";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./UserProfile.module.css"; // תיצור קובץ CSS מתאים

const apiUtils = new ApiUtils();

 function UserProfile({ userId }) {
  const [recentClasses, setRecentClasses] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classes, challenges, weekly] = await Promise.all([
          apiUtils.get(`http://localhost:3000/classes?userId=${userId}&recent=true`),
          apiUtils.get(`http://localhost:3000/users/${userId}/past-challenges`),
          apiUtils.get(`http://localhost:3000/weekly-challenge?userId=${userId}`),
        ]);

        setRecentClasses(classes);
        setPastChallenges(challenges);
        setWeeklyChallenge(weekly);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCompleteWeeklyChallenge = async () => {
    try {
      await apiUtils.patch(`http://localhost:3000/weekly-challenge/${challengeId}/complete`, {
        completed: true,
      });
      setWeeklyChallenge({ ...weeklyChallenge, completed: true });
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (

    <div className={styles.profileContainer}>
      <h2>הפרופיל האישי שלי</h2>

      <section className={styles.section}>
        <h3>שיעורים בחודש האחרון</h3>
        {recentClasses.length === 0 ? (
          <p>לא השתתפת בשיעורים החודש</p>
        ) : (
          <ul>
            {recentClasses.map((cls) => (
              <li key={cls.id}>
                {cls.name} - {new Date(cls.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h3>אתגרים קודמים</h3>
        {pastChallenges.length === 0 ? (
          <p>אין אתגרים קודמים</p>
        ) : (
          <ul>
            {pastChallenges.map((challenge) => (
              <li key={challenge.id}>
                {challenge.title} -{" "}
                {challenge.completed ? "הושלם" : "לא הושלם"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h3>אתגר שבועי</h3>
        {weeklyChallenge ? (
          <div>
            <p>{weeklyChallenge.title}</p>
            {weeklyChallenge.completed ? (
              <p>הושלם ✅</p>
            ) : (
              <button onClick={handleCompleteWeeklyChallenge}>
                סמן כהושלם
              </button>
            )}
          </div>
        ) : (
          <p>אין אתגר שבועי כרגע</p>
        )}
      </section>
    </div>
  );
}

export default UserProfile;
