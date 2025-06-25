import { useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";

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
        // הסתרה אוטומטית אחרי 5 שניות
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
            await ApiUtils.post("http://localhost:3000/challenges/create", formData);
      
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
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-6 border rounded-2xl shadow-md bg-white"
        >
            <h2 className="text-xl font-bold text-center">הוספת אתגר חדש</h2>

            <div>
                <input
                    type="text"
                    name="description"
                    placeholder="תיאור על האתגר"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
                <input
                    type="date"
                    name="week_start_date"
                    value={formData.week_start_date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {errors.week_start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.week_start_date}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        מוסיף...
                    </>
                ) : (
                    "הוסף אתגר"
                )}
            </button>

            {message.show && (
                <div className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
                    message.type === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}
        </form>
    );
};

export default AddChallengeForm;