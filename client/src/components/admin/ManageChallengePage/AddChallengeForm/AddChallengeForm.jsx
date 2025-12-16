import { useState } from "react";
import ApiUtils from "../../../../utils/ApiUtils";
import styles from './AddChallengeForm.module.css';

const AddChallengeForm = () => {
    const [formData, setFormData] = useState({
        description: "",
        week_start_date: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: "", type: "", show: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!formData.description.trim()) {
            newErrors.description = "שדה חובה";
        }
        if (!formData.week_start_date) {
            newErrors.week_start_date = "שדה חובה";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await ApiUtils.post(`${import.meta.env.VITE_API_URL

}/challenges/create`, formData);
      
            showMessage("אתגר נוסף בהצלחה! 🎉", "success");
            setFormData({
                description: "",
                week_start_date: "",
            });
            setErrors({});
            
        } catch (err) {
            showMessage("שגיאה בהוספת האתגר. אנא נסה שוב 😟", "error");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>הוספת אתגר חדש</h2>

            <div className={styles.inputGroup}>
                <input
                    type="text"
                    name="description"
                    placeholder="תיאור על האתגר"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={styles.input}
                />
                {errors.description && (
                    <p className={styles.errorMessage}>{errors.description}</p>
                )}
            </div>

            <div className={styles.inputGroup}>
                <input
                    type="date"
                    name="week_start_date"
                    value={formData.week_start_date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={styles.input}
                />
                {errors.week_start_date && (
                    <p className={styles.errorMessage}>{errors.week_start_date}</p>
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
                        מוסיף...
                    </>
                ) : (
                    "הוסף אתגר"
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

export default AddChallengeForm;