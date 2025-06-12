import React, { useState, useContext, useEffect } from "react";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./UserProfile.module.css"; // תיצור קובץ CSS מתאים
import { AuthContext } from "../AuthContext";

const apiUtils = new ApiUtils();

 function UserProfile() {
    const { user } = useContext(AuthContext);
 const userId=user.id;
  const [recentClasses, setRecentClasses] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState("");
  const [completedWeeklyChallenge, setCompletedWeeklyChallenge] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
        recentClasses,
        recentCompletedChallenges,
        completedWeeklyChallenge,
        weeklyChallenge
      } = await apiUtils.get(`http://localhost:3000/users/${userId}/dashboard`);

      setRecentClasses(recentClasses);
      setPastChallenges(recentCompletedChallenges);
      setCompletedWeeklyChallenge(completedWeeklyChallenge);
      setWeeklyChallenge(weeklyChallenge)
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
      await apiUtils.patch(`http://localhost:3000/users/${userId}/weekly-challenge/${weeklyChallenge.id}/complete`, {
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
                {cls.title} - {new Date(cls.class_types).toLocaleDateString()}
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
                {challenge.description} -{" "}
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
            <p>{weeklyChallenge.description}</p>
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
