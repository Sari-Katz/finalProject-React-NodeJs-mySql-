import React, { useState, useContext, useEffect } from "react";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./UserProfile.module.css"; // תוודא שיש CSS מתאים
import { AuthContext } from "../AuthContext";

const apiUtils = new ApiUtils();

function UserProfile() {
  const { user } = useContext(AuthContext);
  const userId = user.id;

  const [recentClasses, setRecentClasses] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [completedWeeklyChallenge, setCompletedWeeklyChallenge] = useState(false);
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
        setWeeklyChallenge(weeklyChallenge);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCompleteWeeklyChallenge = async (isComplete=true) => {
    try {
      await apiUtils.patch(
        `http://localhost:3000/users/${userId}/weekly-challenge/${weeklyChallenge.id}/complete`,
        { completed: isComplete }
      );
      setCompletedWeeklyChallenge(isComplete);
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  if (loading) return <p>טוען נתונים...</p>;

  return (
    <div className={styles.profileContainer}>
      <h2>הפרופיל האישי שלי</h2>

      {/* שיעורים מהחודש האחרון */}
      <section className={styles.section}>
        <h3>שיעורים בחודש האחרון</h3>
        {recentClasses.length === 0 ? (
          <p>לא השתתפת בשיעורים החודש</p>
        ) : (
          <ul>
            {recentClasses.map((cls) => (
              <li key={cls.id}>
                {cls.title} - {new Date(cls.date_start).toLocaleDateString()} ({cls.day_of_week}) <br />
                {cls.start_time} - {cls.end_time}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* אתגרים קודמים */}
      <section className={styles.section}>
        <h3>אתגרים קודמים</h3>
        {pastChallenges.length === 0 ? (
          <p>אין אתגרים קודמים</p>
        ) : (
          <ul>
            {pastChallenges.map((challenge) => (
              <li key={challenge.id}>
                {challenge.description} - משבוע שהתחיל ב-{new Date(challenge.week_start_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* אתגר שבועי נוכחי */}
      <section className={styles.section}>
        <h3>אתגר שבועי</h3>
        {weeklyChallenge ? (
          <div>
            <p>{weeklyChallenge.description}</p>
            {completedWeeklyChallenge ? (<>
              <p>הושלם ✅</p>
             <button onClick={()=>handleCompleteWeeklyChallenge(false)}>רוצה לבטל ?</button>
               </>
            ) : (
              <button onClick={()=>handleCompleteWeeklyChallenge(true)}>סמן כהושלם</button>
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
