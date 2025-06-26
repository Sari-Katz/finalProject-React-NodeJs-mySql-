import { useState } from "react";
import ApiUtils from "../../../../utils/ApiUtils";
import styles from './AddClassForm.module.css';

const AddClassForm = ({ onClassAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    class_types: "",
    start_time: "",
    end_time: "",
    date_start: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "", show: false });

  const generateTimeOptions = (start = 6, end = 23) => {
    const times = [];
    for (let hour = start; hour <= end; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < end) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  };

  const showMessage = (text, type) => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: "", type: "", show: false });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // מנקה את השגיאה כשמשנים ערך
  };

  const validate = () => {
    const newErrors = {};
    for (let key in formData) {
      if (!formData[key]) {
        newErrors[key] = "שדה חובה";
      }
    }

    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = "שעת הסיום חייבת להיות אחרי שעת ההתחלה";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await ApiUtils.post("http://localhost:3000/classes", formData);
      
      showMessage("קורס נוסף בהצלחה! 🎉", "success");

      setFormData({
        title: "",
        class_types: "",
        start_time: "",
        end_time: "",
        date_start: "",
      });
      setErrors({});
      
      if (onClassAdded) {
        onClassAdded(response);
      }
      
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "שגיאה בהוספת הקורס";
      showMessage(errorMessage + " 😟", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>הוספת קורס חדש</h2>

      <div className={styles.inputGroup}>
        <input
          type="text"
          name="title"
          placeholder="שם הקורס"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting}
        />
        {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
      </div>

      <div className={styles.inputGroup}>
        <input
          type="text"
          name="class_types"
          placeholder="סוג האימון"
          value={formData.class_types}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting}
        />
        {errors.class_types && (
          <p className={styles.errorMessage}>{errors.class_types}</p>
        )}
      </div>

      <div className={styles.timeRow}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>שעת התחלה</label>
          <select
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className={styles.input}
            disabled={isSubmitting}
          >
            <option value="">בחר שעת התחלה</option>
            {generateTimeOptions(6, 22).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.start_time && (
            <p className={styles.errorMessage}>{errors.start_time}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>שעת סיום</label>
          <select
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className={styles.input}
            disabled={isSubmitting}
          >
            <option value="">בחר שעת סיום</option>
            {generateTimeOptions(7, 23).map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.end_time && (
            <p className={styles.errorMessage}>{errors.end_time}</p>
          )}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>תאריך השיעור</label>
        <input
          type="date"
          name="date_start"
          value={formData.date_start}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting}
          min={new Date().toISOString().split('T')[0]} 
        />
        {errors.date_start && (
          <p className={styles.errorMessage}>{errors.date_start}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? (
          <>
            <div className={styles.spinner}></div>
            מוסיף קורס...
          </>
        ) : (
          "הוסף קורס"
        )}
      </button>

      {message.show && (
        <div className={`${styles.message} ${
          message.type === 'success' ? styles.messageSuccess : styles.messageError
        }`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default AddClassForm;