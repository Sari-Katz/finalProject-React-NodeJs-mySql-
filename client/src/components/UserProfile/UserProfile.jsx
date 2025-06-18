import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUtils from "../../utils/ApiUtils";
import styles from "./UserProfile.module.css";
import { AuthContext } from "../AuthContext";
import Info from "./Info";

const apiUtils = new ApiUtils();

function UserProfile() {
  const { user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();
  const userId = user.id;
  const [recentClasses, setRecentClasses] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [completedWeeklyChallenge, setCompletedlyChallenge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);

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
      

  const handleCompleteWeeklyChallenge = async (isComplete = true) => {
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

  const getUserInitial = () => {
    return user?.full_name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "?";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  if (showUserInfo) {
    return <Info onBack={() => setShowUserInfo(false)} />;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <div 
          className={styles.avatarContainer}
          onClick={() => setShowUserInfo(true)}
          title="לחץ לצפייה בפרטי המשתמש"
        >
          <div className={styles.avatar}>
            {getUserInitial()}
          </div>
          <div className={styles.avatarHoverText}>פרטי משתמש</div>
        </div>
      
        <div className={styles.userInfo}>
          <h1 className={styles.welcomeText}>שלום, {user?.full_name || user?.name}! 👋</h1>
          <p className={styles.subtitle}>ברוך הבא לפרופיל האישי שלך</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏃‍♀️</div>
          <div className={styles.statInfo}>
            <h3>{recentClasses.length}</h3>
            <p>שיעורים החודש</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <h3>{pastChallenges.length}</h3>
            <p>אתגרים הושלמו</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{completedWeeklyChallenge ? "כן" : "לא"}</h3>
            <p>אתגר השבוע</p>
          </div>
        </div>
      </div>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <section className={styles.weeklyChallenge}>
          <h2 className={styles.sectionTitle}>🎯 אתגר השבוע</h2>
          <div className={styles.challengeCard}>
            <p className={styles.challengeDescription}>{weeklyChallenge.description}</p>
            <div className={styles.challengeStatus}>
              {completedWeeklyChallenge ? (
                <div className={styles.completed}>
                  <span className={styles.completedText}>הושלם ✅</span>
                  <button 
                    className={styles.undoButton}
                    onClick={() => handleCompleteWeeklyChallenge(false)}
                  >
                    ביטול
                  </button>
                </div>
              ) : (
                <button 
                  className={styles.completeButton}
                  onClick={() => handleCompleteWeeklyChallenge(true)}
                >
                  ✓ סמן כהושלם
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recent Classes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 שיעורים בחודש האחרון</h2>
        <div className={styles.sectionContent}>
          {recentClasses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <p>לא השתתפת בשיעורים החודש</p>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/schedule')}
              >
                צפה בלוח השיעורים
              </button>
            </div>
          ) : (
            <div className={styles.classesList}>
              {recentClasses.map((cls) => (
                <div key={cls.id} className={styles.classCard}>
                  <div className={styles.classHeader}>
                    <h4 className={styles.classTitle}>{cls.title}</h4>
                    <span className={styles.classDate}>
                      {new Date(cls.date_start).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <div className={styles.classDetails}>
                    <span className={styles.classDay}>{cls.day_of_week}</span>
                    <span className={styles.classTime}>{cls.start_time} - {cls.end_time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Challenges */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏅 אתגרים קודמים</h2>
        <div className={styles.sectionContent}>
          {pastChallenges.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎯</div>
              <p>אין אתגרים קודמים</p>
              <p className={styles.emptySubtext}>התחל להשתתף באתגרים כדי לראות אותם כאן</p>
            </div>
          ) : (
            <div className={styles.challengesList}>
              {pastChallenges.map((challenge) => (
                <div key={challenge.id} className={styles.pastChallengeCard}>
                  <div className={styles.challengeIcon}>✅</div>
                  <div className={styles.challengeInfo}>
                    <p className={styles.challengeText}>{challenge.description}</p>
                    <span className={styles.challengeWeek}>
                      שבוע שהתחיל ב-{new Date(challenge.week_start_date).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserProfile;