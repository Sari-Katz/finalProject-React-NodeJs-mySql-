import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddActivity.module.css';
import ApiUtils from '../../utils/ApiUtils';

const AddActivity = () => {
  const navigate = useNavigate();

  // calorie status
  const [remainingCalories, setRemainingCalories] = useState(0);

  // activity states
  const [workoutInput, setWorkoutInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [burnedCalories, setBurnedCalories] = useState(null);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await ApiUtils.get(
          `${import.meta.env.VITE_API_URL}/food-diary/today`
        );
        const remaining =
          data.daily_calorie_goal -
          data.consumed_calories +
          data.burned_calories;

        setRemainingCalories(remaining);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת הנתונים');
      }
    };

    fetchStatus();
  }, []);

  // ---------- UX logic (כמו בדשבורד) ----------
  const isInDeficit = remainingCalories < 0;

  const statusIcon = isInDeficit ? '⚠️' : '🎉';

  const statusTitle = isInDeficit
    ? 'כדי לעמוד ביעד הקלורי של היום'
    : 'המצב הקלורי שלך נראה טוב';

  const statusText = isInDeficit
    ? 'מומלץ להוסיף פעילות גופנית'
    : 'פעילות גופנית תיתן לך יתרון נוסף';

  const statusSubtext = isInDeficit
    ? 'קלוריות לאיזון'
    : 'קלוריות זמינות להיום';

  // ---------- handlers ----------
  const handleAnalyzeWorkout = async () => {
    if (!workoutInput) {
      setError('יש לתאר את הפעילות שביצעת');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setBurnedCalories(null);

    try {
      const res = await ApiUtils.post(
        `${import.meta.env.VITE_API_URL}/food-diary/analyze-activity`,
        { description: workoutInput }
      );
      setBurnedCalories(res.burnedCalories);
    } catch (err) {
      console.error(err);
      setError('שגיאה בניתוח הפעילות');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogActivity = async (calories = burnedCalories) => {
    if (!calories || calories <= 0) return;

    setIsLogging(true);
    setError('');

    try {
      await ApiUtils.post(
        `${import.meta.env.VITE_API_URL}/food-diary/log-activity`,
        { burned_calories: calories }
      );
      navigate('/calorie-dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('שגיאה בתיעוד הפעילות');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        aria-label="חזרה אחורה"
      >
        ← חזרה
      </button>

      {/* ===== STATUS CARD ===== */}
      <div className={styles.statusCard}>
        <div className={styles.statusIcon}>{statusIcon}</div>
        <h2 className={styles.statusTitle}>{statusTitle}</h2>
        <p className={styles.statusText}>{statusText}</p>

        <div className={styles.caloriesHighlight}>
          {Math.abs(remainingCalories)}
        </div>

        <p className={styles.statusSubtext}>{statusSubtext}</p>
      </div>

      {/* ===== CUSTOM ACTIVITY ===== */}
      <div className={styles.workoutCard}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>✍️</span>
          תארי פעילות גופנית
        </h3>
        <p className={styles.sectionSubtitle}>
          ה-AI שלנו יחשב כמה קלוריות שרפת
        </p>

        <textarea
          className={styles.textarea}
          placeholder="לדוגמה: 30 דקות הליכה מהירה, אימון כוח בחדר כושר..."
          value={workoutInput}
          onChange={(e) => setWorkoutInput(e.target.value)}
          rows="4"
        />

        <button
          onClick={handleAnalyzeWorkout}
          disabled={isAnalyzing}
          className={styles.analyzeBtn}
        >
          {isAnalyzing ? (
            <>
              <span className={styles.spinner}></span>
              מחשב...
            </>
          ) : (
            <>
              <span className={styles.btnIcon}>🤖</span>
              חשב קלוריות שנשרפו
            </>
          )}
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {burnedCalories !== null && (
          <div className={styles.burnResult}>
            <div className={styles.resultIcon}>🔥</div>
            <p className={styles.resultText}>
              הערכה היא ששרפת
            </p>
            <div className={styles.resultCalories}>
              {burnedCalories}
            </div>
            <p className={styles.resultUnit}>קלוריות</p>

            <button
              onClick={() => handleLogActivity(burnedCalories)}
              disabled={isLogging}
              className={styles.logBtn}
            >
              {isLogging ? (
                <>
                  <span className={styles.spinner}></span>
                  מתעד...
                </>
              ) : (
                <>
                  <span className={styles.btnIcon}>✓</span>
                  תעדי פעילות ביומן
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.dashBtn}
        onClick={() => navigate('/calorie-dashboard')}
      >
        חזרה למסך הראשי
      </button>
    </div>
  );
};

export default AddActivity;
